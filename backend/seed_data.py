from sqlalchemy.orm import Session
from app.db.session import engine, SessionLocal
from app.db.models import ProfileRecord, InternshipTermRecord, WorkDayRecord, JournalEntryRecord, utc_now
from datetime import date, timedelta

def seed_data():
    with SessionLocal() as session:
        user_id = "mock-user-123"
        
        # 1. Create Profile
        profile = session.get(ProfileRecord, user_id)
        if not profile:
            profile = ProfileRecord(
                user_id=user_id,
                name="Alex Dela Cruz",
                email="alex@example.com",
                avatar_url="https://i.pravatar.cc/80?img=12",
                default_timezone="Asia/Manila",
                school_name="University of the Philippines",
                program="BS Computer Science"
            )
            session.add(profile)
            print("Created profile.")

        # 2. Create Internship Term
        internship = session.query(InternshipTermRecord).filter_by(user_id=user_id).first()
        if not internship:
            start_date = date.today() - timedelta(days=30)
            end_date = start_date + timedelta(days=90)
            internship = InternshipTermRecord(
                user_id=user_id,
                company="Tech Solutions Inc.",
                supervisor="Maria Santos",
                role_title="Software Engineering Intern",
                start_date=start_date,
                end_date=end_date,
                target_hours=300,
                report_title="Final Internship Report",
                is_active=True
            )
            session.add(internship)
            print("Created internship term.")

        # 3. Create some Work Days and Journal Entries
        for i in range(5):
            work_date = date.today() - timedelta(days=i)
            work_day = session.query(WorkDayRecord).filter_by(user_id=user_id, work_date=work_date).first()
            if not work_day:
                work_day = WorkDayRecord(
                    user_id=user_id,
                    work_date=work_date,
                    time_in_local="08:00",
                    time_out_local="17:00",
                    total_minutes=480,
                    timezone="Asia/Manila"
                )
                session.add(work_day)
                session.flush() # To get work_day.id
                
                entry = JournalEntryRecord(
                    user_id=user_id,
                    work_day_id=work_day.id,
                    title=f"Day {5-i} Tasks",
                    content_md=f"Completed task {i+1} and discussed with supervisor.",
                    source_type="text"
                )
                session.add(entry)
                print(f"Created work day and entry for {work_date}.")

        session.commit()
        print("Seed data completed.")

if __name__ == "__main__":
    seed_data()
