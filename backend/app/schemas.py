from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str  # "student" ya "company"

class UserLogin(BaseModel):
    email: str
    password: str

class JobCreate(BaseModel):
    title: str
    description: str
    company_id: int

class ApplicationCreate(BaseModel):
    student_id: int
    job_id: int
    resume_text: str