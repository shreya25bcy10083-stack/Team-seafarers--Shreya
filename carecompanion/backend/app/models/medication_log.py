"""
MedicationLog model.

Table: medication_logs
Purpose: Stores medication adherence history.
Allowed status: taken | missed | snoozed
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class MedicationLog(Base):
    """SQLAlchemy model for the medication_logs table."""

    __tablename__ = "medication_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    medication_id = Column(Integer, ForeignKey("medications.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(20), nullable=False)  # taken | missed | snoozed
    taken_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    medication = relationship("Medication", back_populates="logs")
