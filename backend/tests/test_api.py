import unittest

from fastapi.testclient import TestClient

from main import app


class JournalAssistantApiTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.client = TestClient(app)

    def test_health_endpoints(self) -> None:
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_profile_and_internship_endpoints(self) -> None:
        profile_response = self.client.get("/me/profile")
        internship_response = self.client.get("/me/internship")

        self.assertEqual(profile_response.status_code, 200)
        self.assertEqual(internship_response.status_code, 200)
        self.assertEqual(profile_response.json()["user_id"], "student-alex")
        self.assertEqual(internship_response.json()["company"], "TechFlow Solutions Inc.")

    def test_work_day_and_entry_crud(self) -> None:
        work_day_response = self.client.get("/work-days/2026-04-03")
        self.assertEqual(work_day_response.status_code, 200)
        self.assertEqual(work_day_response.json()["work_date"], "2026-04-03")

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

    def test_job_stream_and_document_update(self) -> None:
        job_response = self.client.post("/jobs/weekly-summary", json={})
        self.assertEqual(job_response.status_code, 201)

        job = job_response.json()
        stream_response = self.client.get(f"/jobs/{job['id']}/stream")
        self.assertEqual(stream_response.status_code, 200)
        self.assertIn("event: completed", stream_response.text)

        document_response = self.client.get(f"/documents/{job['result_document_id']}")
        self.assertEqual(document_response.status_code, 200)
        self.assertEqual(document_response.json()["status"], "ready")

        update_response = self.client.patch(
            f"/documents/{job['result_document_id']}",
            json={"content_md": "Updated weekly summary draft."},
        )
        self.assertEqual(update_response.status_code, 200)
        self.assertIn("Updated weekly summary draft.", update_response.json()["content_md"])


if __name__ == "__main__":
    unittest.main()
