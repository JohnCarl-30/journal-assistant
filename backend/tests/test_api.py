import unittest
from datetime import date

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.api.deps import get_current_user
from app.core.security import AuthenticatedUser
from app.db.base import Base
from app.db.models import InternshipTermRecord, JournalEntryRecord, ProfileRecord, WorkDayRecord
from app.db.session import get_db_session
from main import app


class JournalAssistantApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.engine = create_engine(
            "sqlite+pysqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
            future=True,
        )
        cls.TestSessionLocal = sessionmaker(
            bind=cls.engine,
            autoflush=False,
            autocommit=False,
            expire_on_commit=False,
        )
        Base.metadata.create_all(cls.engine)

        def override_db_session():
            with cls.TestSessionLocal() as session:
                yield session

        app.dependency_overrides[get_db_session] = override_db_session
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls) -> None:
        app.dependency_overrides.clear()
        Base.metadata.drop_all(cls.engine)
        cls.engine.dispose()

    def setUp(self) -> None:
        with self.TestSessionLocal() as session:
            session.query(JournalEntryRecord).delete()
            session.query(WorkDayRecord).delete()
            session.query(InternshipTermRecord).delete()
            session.query(ProfileRecord).delete()

            session.add_all(
                [
                    ProfileRecord(
                        user_id="user-one",
                        name="User One",
                        email="user-one@example.com",
                        default_timezone="Asia/Manila",
                    ),
                    ProfileRecord(
                        user_id="user-two",
                        name="User Two",
                        email="user-two@example.com",
                        default_timezone="Asia/Manila",
                    ),
                ]
            )
            session.add_all(
                [
                    InternshipTermRecord(
                        id="term-one",
                        user_id="user-one",
                        company="TechFlow Solutions Inc.",
                        supervisor="Maria Santos",
                        role_title="CS Intern",
                        start_date=date(2026, 3, 9),
                        end_date=date(2026, 5, 29),
                        target_hours=300,
                        report_title="Final Internship Report",
                        is_active=True,
                    ),
                    InternshipTermRecord(
                        id="term-two",
                        user_id="user-two",
                        company="Second Company",
                        supervisor="Lead Two",
                        role_title="CS Intern",
                        start_date=date(2026, 3, 9),
                        end_date=date(2026, 5, 29),
                        target_hours=300,
                        report_title="Final Internship Report",
                        is_active=True,
                    ),
                ]
            )
            session.commit()

        app.dependency_overrides[get_current_user] = lambda: AuthenticatedUser(
            user_id="user-one",
            email="user-one@example.com",
            name="User One",
            avatar_url=None,
            default_timezone="Asia/Manila",
        )

    def tearDown(self) -> None:
        app.dependency_overrides.pop(get_current_user, None)

    def test_health_endpoints(self) -> None:
        app.dependency_overrides.pop(get_current_user, None)

        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_requires_authentication_for_profile(self) -> None:
        app.dependency_overrides.pop(get_current_user, None)

        response = self.client.get("/me/profile")
        self.assertEqual(response.status_code, 401)

    def test_profile_and_internship_endpoints(self) -> None:
        profile_response = self.client.get("/me/profile")
        internship_response = self.client.get("/me/internship")

        self.assertEqual(profile_response.status_code, 200)
        self.assertEqual(internship_response.status_code, 200)
        self.assertEqual(profile_response.json()["user_id"], "user-one")
        self.assertEqual(internship_response.json()["company"], "TechFlow Solutions Inc.")

    def test_work_day_and_entry_crud(self) -> None:
        work_day_response = self.client.get("/work-days/2026-04-03")
        self.assertEqual(work_day_response.status_code, 200)
        self.assertEqual(work_day_response.json()["work_date"], "2026-04-03")

        update_work_day_response = self.client.put(
            "/work-days/2026-04-03",
            json={"time_in_local": "08:30", "time_out_local": "16:30"},
        )
        self.assertEqual(update_work_day_response.status_code, 200)
        self.assertEqual(update_work_day_response.json()["total_minutes"], 480)

        create_response = self.client.post(
            "/work-days/2026-04-03/entries",
            json={
                "title": "Added a new entry",
                "content_md": "Documented the next implementation step.",
            },
        )
        self.assertEqual(create_response.status_code, 201)
        entry_id = create_response.json()["id"]

        patch_response = self.client.patch(
            f"/entries/{entry_id}",
            json={"content_md": "Documented and refined the next implementation step."},
        )
        self.assertEqual(patch_response.status_code, 200)
        self.assertIn("refined", patch_response.json()["content_md"])

        list_response = self.client.get("/work-days/2026-04-03/entries")
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(len(list_response.json()), 1)

        delete_response = self.client.delete(f"/entries/{entry_id}")
        self.assertEqual(delete_response.status_code, 204)

    def test_user_cannot_access_another_users_entry(self) -> None:
        create_response = self.client.post(
            "/work-days/2026-04-03/entries",
            json={
                "title": "Private entry",
                "content_md": "Owned by user one.",
            },
        )
        self.assertEqual(create_response.status_code, 201)
        entry_id = create_response.json()["id"]

        app.dependency_overrides[get_current_user] = lambda: AuthenticatedUser(
            user_id="user-two",
            email="user-two@example.com",
            name="User Two",
            avatar_url=None,
            default_timezone="Asia/Manila",
        )

        response = self.client.patch(
            f"/entries/{entry_id}",
            json={"content_md": "Attempted overwrite."},
        )
        self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
