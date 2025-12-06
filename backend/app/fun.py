import bcrypt


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed_password.decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))


def _row_to_shift(row):
    # row order matches SELECT below
    # (s.id, s.employee_id, u.employee_code, u.firstname, u.lastname,
    #  s.date, s.start_time, s.end_time,
    #  s.created_by, a.employee_code, a.firstname, a.lastname, s.created_at)
    (
        id_,
        employee_id,
        employee_code,
        emp_first,
        emp_last,
        date_,
        start_time,
        end_time,
        created_by_id,
        creator_code,
        creator_first,
        creator_last,
        created_at,
    ) = row
    return {
        "id": id_,
        "employee_id": employee_id,
        "employee_code": employee_code or "",
        "employee_name": f"{emp_first} {emp_last}",
        "date": date_,
        "start_time": start_time,
        "end_time": end_time,
        "created_by_id": created_by_id,
        "created_by_code": creator_code,
        "created_by_name": f"{creator_first} {creator_last}" if creator_first else None,
        "created_at": created_at,
    }
