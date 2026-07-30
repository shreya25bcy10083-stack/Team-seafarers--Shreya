"""
Auth Service.

Business logic for user registration and login.
Services never return HTTP responses or access request objects.
"""

from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.repositories.patient_repository import PatientRepository
from app.repositories.caregiver_repository import CaregiverRepository
from app.core.security import hash_password, verify_password, create_access_token
from app.core.exceptions import ConflictException, UnauthorizedException, BadRequestException


class AuthService:
    """Handles registration, login, and token generation."""

    def __init__(self, db: Session):
        self.user_repo = UserRepository(db)
        self.patient_repo = PatientRepository(db)
        self.caregiver_repo = CaregiverRepository(db)

    def register(self, name: str, email: str, password: str, role: str) -> int:
        """
        Register a new user.

        Args:
            name: Full name.
            email: Email address.
            password: Plaintext password.
            role: 'patient' or 'caregiver'.

        Returns:
            The new user's ID.

        Raises:
            ConflictException: If email is already registered.
            BadRequestException: If role is invalid.
        """
        if role not in ("patient", "caregiver"):
            raise BadRequestException(message="Role must be 'patient' or 'caregiver'.")

        if self.user_repo.email_exists(email):
            raise ConflictException(message="Email is already registered.")

        hashed = hash_password(password)
        user = self.user_repo.create(
            full_name=name, email=email, password_hash=hashed, role=role
        )

        # Create corresponding profile
        if role == "patient":
            self.patient_repo.create(user_id=user.id)
        else:
            self.caregiver_repo.create(user_id=user.id)

        return user.id

    def login(self, email: str, password: str) -> dict:
        """
        Authenticate a user and return a JWT token.

        Returns:
            Dict with 'token' and 'role'.

        Raises:
            UnauthorizedException: If credentials are invalid.
        """
        user = self.user_repo.get_by_email(email)
        if not user:
            raise UnauthorizedException(message="Invalid email or password.")

        if not verify_password(password, user.password_hash):
            raise UnauthorizedException(message="Invalid email or password.")

        token = create_access_token(data={"sub": str(user.id), "role": user.role})

        return {"token": token, "role": user.role, "user_id": user.id}
