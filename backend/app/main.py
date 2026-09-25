from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="Smart Job & Resume Matcher")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from app import models
from app.database import engine

models.Base.metadata.create_all(bind=engine)
from app.database import engine
"""
Smart Job & Resume Matcher - Backend Starter
This is the starting point. Run it and add more code step by step.
"""




@app.get("/")
def home():
    return {"message": "Backend is working!"}


# STEP 1 (next): Add database connection here
# STEP 2 (next): Add User, Job, Application models
# STEP 3 (next): Add routes to register user, post job, apply job
# STEP 4 (next): Add resume-job matching AI logic
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app import models, schemas
from app.database import SessionLocal

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    new_user = models.User(name=user.name, email=user.email, password=hashed_password, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully", "user_id": new_user.id}

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    return {"message": "Login successful", "user_id": db_user.id, "role": db_user.role, "name": db_user.name}

@app.post("/jobs")
def create_job(job: schemas.JobCreate, db: Session = Depends(get_db)):
    new_job = models.Job(title=job.title, description=job.description, company_id=job.company_id)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return {"message": "Job posted successfully", "job_id": new_job.id}


@app.get("/jobs")
def get_jobs(db: Session = Depends(get_db)):
    jobs = db.query(models.Job).all()
    return jobs


from app.matcher import calculate_match_score

@app.post("/apply")
def apply_job(application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == application.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    score = calculate_match_score(application.resume_text, job.description)

    new_application = models.Application(
        student_id=application.student_id,
        job_id=application.job_id,
        resume_text=application.resume_text,
        match_score=score
    )
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    return {
        "message": "Applied successfully",
        "application_id": new_application.id,
        "match_score": score
    }

@app.get("/my-applications/{student_id}")
def get_my_applications(student_id: int, db: Session = Depends(get_db)):
    applications = db.query(models.Application).filter(models.Application.student_id == student_id).all()
    result = []
    for app_item in applications:
        job = db.query(models.Job).filter(models.Job.id == app_item.job_id).first()
        result.append({
            "application_id": app_item.id,
            "job_title": job.title if job else "Unknown",
            "match_score": app_item.match_score
        })
    return result


@app.get("/job-applicants/{job_id}")
def get_job_applicants(job_id: int, db: Session = Depends(get_db)):
    applications = db.query(models.Application).filter(models.Application.job_id == job_id).order_by(models.Application.match_score.desc()).all()
    result = []
    for app_item in applications:
        student = db.query(models.User).filter(models.User.id == app_item.student_id).first()
        result.append({
            "application_id": app_item.id,
            "student_name": student.name if student else "Unknown",
            "student_email": student.email if student else "",
            "match_score": app_item.match_score
        })
    return result


@app.get("/my-jobs/{company_id}")
def get_my_jobs(company_id: int, db: Session = Depends(get_db)):
    jobs = db.query(models.Job).filter(models.Job.company_id == company_id).all()
    return jobs