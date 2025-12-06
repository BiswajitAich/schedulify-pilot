from fastapi import APIRouter
import psycopg

from app.types import (
    DeleteUserRequest,
    EmployeeListItem,
    ResponseEmployeeDataList,
    ResponseSuccess,
    NewEmployeeData,
)
from app.db.connections import get_pool
from app.fun import hash_password

router = APIRouter()


@router.post("/add-employee/")
async def add_employee(data: NewEmployeeData) -> ResponseSuccess:
    try:
        print(data)
        first_id = 1001
        pool = await get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                        SELECT COUNT(*) FROM users 
                        WHERE email=%s;
                    """,
                    (data.email,),
                )
                employeeEmailPresent = (await cur.fetchone())[0]
                if employeeEmailPresent > 0:
                    return ResponseSuccess(
                        success=False,
                        message="Employee email already present.",
                    )
                await cur.execute(
                    """
                        SELECT COUNT(*) FROM users 
                        WHERE role='employee' AND department=%s;
                    """,
                    (data.department,),
                )
                TotalNumberOfEmployee = (await cur.fetchone())[0]
                hashed_pw = hash_password(data.password)
                employee_code = data.department.upper() + str(
                    TotalNumberOfEmployee + first_id
                )

                await cur.execute(
                    """
                        INSERT INTO users (
                        firstname, lastname, email, password_hash, role, employee_code, department
                        ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s
                        ) RETURNING employee_code;
                    """,
                    (
                        data.firstname,
                        data.lastname,
                        data.email,
                        hashed_pw,
                        "employee",
                        employee_code,
                        data.department,
                    ),
                )
                created_employee_code_data = await cur.fetchone()
                success = created_employee_code_data is not None
                if not success:
                    return ResponseSuccess(
                        success=False,
                        message="Employee data input failed.",
                    )
        return ResponseSuccess(
            success=True,
            message=f"Employee created successfully.\n Employee id: {created_employee_code_data}",
        )
    except psycopg.errors.UniqueViolation:
        return ResponseSuccess(success=False, message="Employee already exists.")
    except Exception:
        return ResponseSuccess(
            success=False,
            message="Something went wrong during employee addition.",
        )


@router.get("/get-employee-list/")
async def get_employee_list() -> ResponseEmployeeDataList:
    try:
        pool = await get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                        SELECT id, firstname, lastname, employee_code, department 
                        FROM users WHERE role='employee';
                    """
                )
                rows = await cur.fetchall()
            if not rows:
                return ResponseEmployeeDataList(
                    success=False, message="No employees found.", data=[]
                )
            employees = [
                EmployeeListItem(
                    id=row[0],
                    firstname=row[1],
                    lastname=row[2],
                    employee_code=row[3],
                    department=row[4],
                )
                for row in rows
            ]
        return ResponseEmployeeDataList(
            success=True, message="Employee list fetched successfully.", data=employees
        )
    except Exception:
        return ResponseEmployeeDataList(
            success=False, message="Something went wrong !.", data=None
        )


@router.delete("/delete-user/")
async def delete_user(data: DeleteUserRequest) -> ResponseSuccess:
    try:
        pool = await get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:

                # Check if user exists
                await cur.execute(
                    """
                    SELECT id FROM users WHERE id = %s;
                    """,
                    (str(data.id),)
                )
                user = await cur.fetchone()

                if not user:
                    return ResponseSuccess(
                        success=False,
                        message="User not found."
                    )

                await cur.execute(
                    """
                    DELETE FROM users WHERE id=%s RETURNING id;
                    """,
                    (str(data.id),)
                )

                deleted = await cur.fetchone()
                if not deleted:
                    return ResponseSuccess(
                        success=False,
                        message="Failed to delete user."
                    )

        return ResponseSuccess(
            success=True,
            message="User deleted successfully."
        )

    except Exception as e:
        print("Delete user error:", e)
        return ResponseSuccess(
            success=False,
            message="Something went wrong during user deletion."
        )