"""
CareCompanion Database Configuration.

SQLAlchemy engine, session factory, and Base model.
Uses Neon PostgreSQL as defined in DATABASE_SCHEMA.md.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import get_settings

settings = get_settings()

db_url = settings.DATABASE_URL
if db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)
elif db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+psycopg://", 1)

engine_kwargs = {"pool_pre_ping": True}
if not db_url.startswith("sqlite"):
    engine_kwargs.update({"pool_size": 5, "max_overflow": 10})
else:
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(db_url, **engine_kwargs)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    """
    Dependency that provides a database session per request.

    Yields a session and ensures it is closed after the request.
    Following Transaction Rules: commit once, rollback on failure,
    close session after request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
