from app.db.base import Base
from app.db.session import engine
from app.db.models import ProfileRecord, InternshipTermRecord, WorkDayRecord, JournalEntryRecord

def create_tables():
    print(f"Creating tables for {engine.url}...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    create_tables()
