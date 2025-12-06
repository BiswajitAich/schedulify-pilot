from app.db.connections import get_pool


async def initialize_database():
    """Initialize database tables"""
    try:
        pool = await get_pool()
        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS users (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        firstname TEXT NOT NULL,
                        lastname TEXT NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        password_hash TEXT NOT NULL,
                        role TEXT NOT NULL CHECK (role IN ('admin', 'employee')),
                        employee_code TEXT DEFAULT NULL,
                        department TEXT DEFAULT NULL,
                        profile_photo TEXT DEFAULT NULL,
                        profile_banner TEXT DEFAULT NULL,
                        created_at TIMESTAMP DEFAULT NOW(),
                        updated_at TIMESTAMP DEFAULT NOW()
                    );
                """
                )

        async with pool.connection() as conn:
            async with conn.cursor() as cur:
                await cur.execute(
                    """
                    CREATE TABLE IF NOT EXISTS shifts (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        employee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                        date DATE NOT NULL,
                        start_time TIME NOT NULL,
                        end_time TIME NOT NULL,
                        created_by UUID NOT NULL REFERENCES users(id),
                        created_at TIMESTAMP DEFAULT NOW()
                    );
                """
                )

        print("Database tables initialized successfully")
    except Exception as e:
        print(f"Database initialization failed: {e}")
