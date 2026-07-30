"""
Caregiver Repository.

Database operations for caregivers and patient_caregivers tables.
"""

from sqlalchemy.orm import Session
from app.models.caregiver import Caregiver
from app.models.patient_caregiver import PatientCaregiver


class CaregiverRepository:
    """Database access for Caregiver and PatientCaregiver models."""

    def __init__(self, db: Session):
        self.db = db

    def get_by_user_id(self, user_id: int) -> Caregiver | None:
        """Fetch caregiver by user ID."""
        return self.db.query(Caregiver).filter(Caregiver.user_id == user_id).first()

    def create(self, user_id: int, **kwargs) -> Caregiver:
        """Create a new caregiver profile."""
        caregiver = Caregiver(user_id=user_id, **kwargs)
        self.db.add(caregiver)
        self.db.commit()
        self.db.refresh(caregiver)
        return caregiver

    def create_link(self, patient_id: int, caregiver_id: int, invite_code: str) -> PatientCaregiver:
        """Create a patient-caregiver link."""
        link = PatientCaregiver(
            patient_id=patient_id,
            caregiver_id=caregiver_id,
            invite_code=invite_code,
            status="accepted",
        )
        self.db.add(link)
        self.db.commit()
        self.db.refresh(link)
        return link

    def get_link_by_invite_code(self, invite_code: str) -> PatientCaregiver | None:
        """Find a patient-caregiver link by invite code."""
        return (
            self.db.query(PatientCaregiver)
            .filter(PatientCaregiver.invite_code == invite_code)
            .first()
        )

    def get_patients_for_caregiver(self, caregiver_id: int) -> list[PatientCaregiver]:
        """Get all patient links for a caregiver."""
        return (
            self.db.query(PatientCaregiver)
            .filter(PatientCaregiver.caregiver_id == caregiver_id)
            .all()
        )

    def get_caregivers_for_patient(self, patient_id: int) -> list[PatientCaregiver]:
        """Get all caregiver links for a patient."""
        return (
            self.db.query(PatientCaregiver)
            .filter(PatientCaregiver.patient_id == patient_id)
            .all()
        )
