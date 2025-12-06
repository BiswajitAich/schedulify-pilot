from fastapi import APIRouter
import psycopg
from app.db.connections import get_pool
from app.fun import hash_password, verify_password
from app.types import LoginRequestData, Response, SignupRequestData

router = APIRouter()


@router.post("/signup/")
async def signup(data: SignupRequestData) -> Response:
    try:
        print(data)
        user_data = None
        hashed_pw = hash_password(data.password)

        pool = await get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    f"""
                        SELECT COUNT(*) AS  TotalNumberOfAdmin FROM users
                        WHERE role='admin';
                    """
                )
                TotalNumberOfAdmin = (await cur.fetchone())[0]
                if TotalNumberOfAdmin >= 2:
                    return Response(
                        success=False,
                        message="Admin limit reached — contact an existing admin.",
                        user_data=user_data,
                    )

                await cur.execute(
                    f"""
                        INSERT INTO users (
                        firstname, lastname, email, password_hash, role
                        ) VALUES (
                        %s, %s, %s, %s, %s
                        ) RETURNING 
                        id, firstname, lastname, email, profile_photo, profile_banner;
                    """,
                    (
                        data.firstname,
                        data.lastname,
                        data.email,
                        hashed_pw,
                        "admin",
                    ),
                )
                created_user_data = await cur.fetchone()
                success = created_user_data is not None
                if not success:
                    return Response(
                        success=False,
                        message="Admin data input failed.",
                        user_data=user_data,
                    )
                id, firstname, lastname, email, profile_photo, profile_banner = (
                    created_user_data
                )
                user_data = {
                    "id": id,
                    "firstname": firstname,
                    "lastname": lastname,
                    "email": email,
                    "profile_photo": profile_photo,
                    "profile_banner": profile_banner,
                    "role": "admin",
                }
        return Response(
            success=True, message="Admin created successfully.", user_data=user_data
        )
    except psycopg.errors.UniqueViolation:
        return Response(
            success=False, message="Email already exists.", user_data=user_data
        )
    except Exception:
        return Response(
            success=False,
            message="Something went wrong during signup.",
            user_data=user_data,
        )


@router.post("/login/")
async def login(data: LoginRequestData) -> Response:
    try:
        success = True
        user_data = None
        pool = await get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    f"""
                        SELECT id, firstname, lastname, email,
                        password_hash, profile_photo, profile_banner, role 
                        FROM users WHERE email=%s;
                    """,
                    (data.email,),
                )
                present_user_data = await cur.fetchone()
                if not present_user_data:
                    return Response(
                        success=False, message="User not found.", user_data=user_data
                    )
                (
                    id,
                    firstname,
                    lastname,
                    email,
                    password_hash,
                    profile_photo,
                    profile_banner,
                    role,
                ) = present_user_data
                success = verify_password(
                    password=data.password, hashed_password=password_hash
                )
                if not success:
                    return Response(
                        success=success,
                        message="Incorrect password",
                        user_data=user_data,
                    )
                user_data = {
                    "id": id,
                    "firstname": firstname,
                    "lastname": lastname,
                    "email": email,
                    "profile_photo": profile_photo,
                    "profile_banner": profile_banner,
                    "role": role,
                }
        return Response(
            success=success, message="successfully Logged in.", user_data=user_data
        )
    except Exception:
        return Response(
            success=False,
            message="Something went wrong, please try again.",
            user_data=user_data,
        )
