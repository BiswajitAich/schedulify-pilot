from contextlib import asynccontextmanager
from fastapi import FastAPI
from psycopg_pool import AsyncConnectionPool
from app.routers import auth, users, shifts
from app.db.connections import get_db_url, set_pool
from app.db.init_db import initialize_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with AsyncConnectionPool(get_db_url()) as pool:
        set_pool(pool)
        print("connection.pool:", pool)
        try:
            await initialize_database()
            yield
        except Exception:
            import traceback

            traceback.print_exc()
        finally:
            await pool.close()
            print("🧹 Connection pool closed cleanly.")


app = FastAPI(lifespan=lifespan)

app.include_router(users.router, prefix="/users/v1", tags=["users"])
app.include_router(auth.router, prefix="/auth/v1", tags=["auth"])
app.include_router(shifts.router, prefix="/shifts/v1", tags=["shifts"])


@app.get("/")
def main():
    return {
        "status": "online",
        "message": "This is Employee Shift Management backend api...",
    }


@app.get("/health")
def main():
    return {"status": 200}
