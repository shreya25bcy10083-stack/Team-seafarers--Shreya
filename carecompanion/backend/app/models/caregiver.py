"""
Caregiver model.

Table: caregivers
Purpose: Stores caregiver profile.
Relationship: One User → One Caregiver
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class Caregiver(Base):
    """SQLAlchemy model for the caregivers table."""

    __tablename__ = "caregivers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    phone = Column(String(20), nullable=True)
    relationship_type = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="caregiver")
    patient_caregivers = relationship("PatientCaregiver", back_populates="caregiver")
