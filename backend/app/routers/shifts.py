from datetime import time
from uuid import UUID
from fastapi import APIRouter

from app.db.connections import get_pool
from app.types import EmployeeShiftData, ResponseExtra, ResponseShiftList, ResponseSuccess
from app.fun import _row_to_shift


router = APIRouter()


@router.post("/add-employee-shifts/")
async def add_employee_shifts(data: EmployeeShiftData) -> ResponseSuccess:
    try:
        pool = await get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:

                # check employee exists
                await cur.execute(
                    """
                    SELECT employee_code 
                    FROM users 
                    WHERE id=%s AND role='employee';
                    """,
                    (data.id,),
                )
                employee = await cur.fetchone()

                if employee is None:
                    return ResponseSuccess(
                        success=False,
                        message="Employee not found.",
                    )

                employee_code = employee[0]

                # -------- FIX: handle midnight 00:00 ----------
                new_end = data.end_time
                if new_end == time(0, 0):
                    new_end = time(23, 59, 59)

                # check overlap
                await cur.execute(
                    """
                    SELECT date, start_time, end_time 
                    FROM shifts
                    WHERE employee_id=%s 
                      AND date=%s
                      AND (%s < end_time AND %s > start_time);
                    """,
                    (
                        data.id,
                        data.date,
                        data.start_time,
                        new_end,
                    ),
                )

                conflict = await cur.fetchone()

                if conflict:
                    date, start_time, end_time = conflict
                    return ResponseSuccess(
                        success=False,
                        message=(
                            f"Employee({employee_code}) already has a shift on "
                            f"{date} between {start_time} and {end_time}."
                        ),
                    )

                # insert new shift ---- FIXED SQL ----
                await cur.execute(
                    """
                    INSERT INTO shifts (employee_id, date, start_time, end_time, created_by)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id;
                    """,
                    (
                        data.id,
                        data.date,
                        data.start_time,
                        new_end,
                        data.created_by,
                    ),
                )

                new_shift = await cur.fetchone()

                if not new_shift:
                    return ResponseSuccess(
                        success=False, message="Failed to create shift."
                    )

        return ResponseSuccess(
            success=True, message=f"Shift assigned to {employee_code} successfully."
        )

    except Exception as e:
        print(e)
        return ResponseSuccess(
            success=False,
            message="Something went wrong while creating shift.",
        )


@router.get("/get-all-shifts/")
async def get_all_shifts() -> ResponseShiftList:
    try:
        pool = await get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    SELECT
                      s.id,
                      s.employee_id,
                      u.employee_code,
                      u.firstname,
                      u.lastname,
                      s.date,
                      s.start_time,
                      s.end_time,
                      s.created_by,
                      a.employee_code as creator_code,
                      a.firstname as creator_first,
                      a.lastname as creator_last,
                      s.created_at
                    FROM shifts s
                    JOIN users u ON s.employee_id = u.id
                    LEFT JOIN users a ON s.created_by = a.id
                    ORDER BY s.date DESC, s.start_time ASC;
                    """
                )
                rows = await cur.fetchall()

        if not rows:
            return ResponseShiftList(success=True, message="No shifts found.", data=[])

        data = [_row_to_shift(r) for r in rows]
        return ResponseShiftList(success=True, message="Shifts fetched.", data=data)
    except Exception as e:
        print("get_all_shifts error:", e)
        return ResponseShiftList(success=False, message="Failed to fetch shifts.", data=None)


@router.get("/get-my-shifts/{employee_id}/")
async def get_my_shifts(employee_id: UUID) -> ResponseShiftList:
    try:
        pool = await get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    SELECT
                      s.id,
                      s.employee_id,
                      u.employee_code,
                      u.firstname,
                      u.lastname,
                      s.date,
                      s.start_time,
                      s.end_time,
                      s.created_by,
                      a.employee_code as creator_code,
                      a.firstname as creator_first,
                      a.lastname as creator_last,
                      s.created_at
                    FROM shifts s
                    JOIN users u ON s.employee_id = u.id
                    LEFT JOIN users a ON s.created_by = a.id
                    WHERE s.employee_id = %s
                    ORDER BY s.date DESC, s.start_time ASC;
                    """,
                    (employee_id,),
                )
                rows = await cur.fetchall()

        if not rows:
            return ResponseShiftList(success=True, message="No shifts found for this employee.", data=[])

        data = [_row_to_shift(r) for r in rows]
        return ResponseShiftList(success=True, message="Shifts fetched.", data=data)
    except Exception as e:
        print("get_my_shifts error:", e)
        return ResponseShiftList(success=False, message="Failed to fetch shifts.", data=None)
    
    
@router.get("/get-extra-info/")
async def get_extra_info() -> ResponseExtra:
    try:
        pool = await get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:

                await cur.execute("""
                    SELECT COUNT(*) FROM users 
                    WHERE role='employee';
                """)
                total_emp = (await cur.fetchone())[0]

                await cur.execute("""
                    SELECT COUNT(*) FROM shifts
                    WHERE date = CURRENT_DATE;
                """)
                todays_shifts = (await cur.fetchone())[0]

                await cur.execute("""
                    SELECT date, start_time, end_time 
                    FROM shifts
                    WHERE date >= CURRENT_DATE
                    ORDER BY date ASC, start_time ASC
                    LIMIT 1;
                """)
                row = await cur.fetchone()

                if row:
                    upcoming_date, upcoming_start, upcoming_end = row
                else:
                    upcoming_date = None
                    upcoming_start = None
                    upcoming_end = None

        return ResponseExtra(
            success=True,
            message="extra info loaded",
            totalEmployee=total_emp,
            totalShifts=todays_shifts,
            upcomingShift_date=upcoming_date,
            upcomingShift_startTime=upcoming_start,
            upcomingShift_endTime=upcoming_end,
        )

    except Exception as e:
        print("get_extra_info error:", e)
        return ResponseExtra(
            success=False,
            message="Failed to load dashboard info",
        )

