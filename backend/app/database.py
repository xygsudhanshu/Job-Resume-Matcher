from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Yahan apna postgres password daalo (jo install ke time set kiya tha)
DATABASE_URL = "postgresql://postgres:Qazwsx230408%40@localhost:5432/job_portal_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()