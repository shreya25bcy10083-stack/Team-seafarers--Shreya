"""
SOSEvent model.

Table: sos_events
Purpose: Stores emergency activations.
Status: triggered | resolved | cancelled
"""

from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class SOSEvent(Base):
    """SQLAlchemy model for the sos_events table."""

    __tablename__ = "sos_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    latitude = Column(Numeric(precision=10, scale=7), nullable=True)
    longitude = Column(Numeric(precision=10, scale=7), nullable=True)
    status = Column(String(30), nullable=False, default="triggered")  # triggered | resolved | cancelled
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="sos_events")
