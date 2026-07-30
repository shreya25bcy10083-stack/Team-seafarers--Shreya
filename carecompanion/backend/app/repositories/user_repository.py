"""
User Repository.

Database operations for the users table.
Repositories only communicate with the database.
"""

from sqlalchemy.orm import Session
from app.models.user import User


class UserRepository:
    """Database access for User model."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> User | None:
        """Fetch user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> User | None:
        """Fetch user by email."""
        return self.db.query(User).filter(User.email == email).first()

    def create(self, full_name: str, email: str, password_hash: str, role: str) -> User:
        """Create a new user."""
        user = User(
            full_name=full_name,
            email=email,
            password_hash=password_hash,
            role=role,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def email_exists(self, email: str) -> bool:
        """Check if an email is already registered."""
        return self.db.query(User).filter(User.email == email).first() is not None
