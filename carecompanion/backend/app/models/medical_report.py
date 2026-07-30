"""
MedicalReport model.

Table: medical_reports
Purpose: Stores uploaded reports with AI summaries.
Relationship: One Patient → Many Reports
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base


class MedicalReport(Base):
    """SQLAlchemy model for the medical_reports table."""

    __tablename__ = "medical_reports"

    id = Column(Integer, primary_key=True, autoincrement=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    report_name = Column(String(255), nullable=False, index=True)
    report_url = Column(Text, nullable=False)
    ai_summary = Column(Text, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    patient = relationship("Patient", back_populates="medical_reports")
