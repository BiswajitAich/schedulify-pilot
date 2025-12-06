from psycopg_pool import AsyncConnectionPool
from functools import lru_cache
from dotenv import load_dotenv
import os

pool: AsyncConnectionPool | None = None

load_dotenv()

@lru_cache()
def get_db_url() -> str:
    return os.getenv("DATABASE_URL")


async def get_pool() -> AsyncConnectionPool:
    """Get the global database pool instance"""
    global pool
    try:
        if pool is None or pool.closed:
            print("⚠️ Database pool was closed or uninitialized. Reopening...")
            pool = AsyncConnectionPool(get_db_url())
            await pool.open()
        return pool
    except Exception as e:
        print(f"❌ Pool validation failed: {e}. Reinitializing pool...")
        try:
            pool = AsyncConnectionPool(get_db_url())
            await pool.open()
            print("✅ Pool reinitialized successfully.")
            return pool
        except Exception as e2:
            print(f"💥 Failed to reinitialize pool: {e2}")
            raise RuntimeError("Database pool reinitialization failed") from e2


def set_pool(new_pool: AsyncConnectionPool) -> None:
    """Set the global database pool instance"""
    global pool
    pool = new_pool
