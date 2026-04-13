from fastapi import Header


def get_current_user_id(
    x_demo_user: str = Header(default="student-alex", alias="X-Demo-User"),
) -> str:
    return x_demo_user or "student-alex"
