from typing import List
from uuid import UUID
from datetime import date, datetime, time
from pydantic import BaseModel, EmailStr


# -----------auth types----------------
class UserData(BaseModel):
    id: UUID
    firstname: str
    lastname: str
    email: EmailStr
    profile_photo: str | None
    profile_banner: str | None
    role: str | None


class ResponseSuccess(BaseModel):
    success: bool
    message: str


class Response(ResponseSuccess):
    user_data: UserData | None


class SignupRequestData(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    password: str


class LoginRequestData(BaseModel):
    email: EmailStr
    password: str


# -------------users types---------------
class NewEmployeeData(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    password: str
    department: str


class EmployeeListItem(BaseModel):
    id: UUID
    firstname: str
    lastname: str
    employee_code: str
    department: str


class ResponseEmployeeDataList(BaseModel):
    success: bool
    message: str
    data: list[EmployeeListItem] | None = None


class EmployeeShiftData(BaseModel):
    id: UUID
    date: date
    start_time: time
    end_time: time
    created_by: str


class ShiftItem(BaseModel):
    id: UUID
    employee_id: UUID
    employee_code: str
    employee_name: str
    date: date
    start_time: time
    end_time: time
    created_by_id: UUID
    created_by_code: str | None
    created_by_name: str | None
    created_at: datetime | None
    
    
class ResponseShiftList(BaseModel):
    success: bool
    message: str
    data: list[ShiftItem] | None = None
    
    
class ResponseExtra(BaseModel):
    success: bool
    message: str
    totalEmployee: int | None = None
    totalShifts: int | None = None
    upcomingShift_date: date | None = None
    upcomingShift_startTime: time | None = None
    upcomingShift_endTime: time | None = None

class DeleteUserRequest(BaseModel):
    id: UUID

    