"""
Caregiver Service.

Business logic for caregiver joining, dashboard, and patient monitoring.
"""

from sqlalchemy.orm import Session
from app.repositories.caregiver_repository import CaregiverRepository
from app.repositories.patient_repository import PatientRepository
from app.repositories.medication_repository import MedicationRepository
from app.repositories.wellness_repository import WellnessRepository
from app.repositories.report_repository import ReportRepository
from app.core.exceptions import NotFoundException, BadRequestException


class CaregiverService:
    """Handles caregiver joining, dashboard, and patient monitoring."""

    def __init__(self, db: Session):
        self.caregiver_repo = CaregiverRepository(db)
        self.patient_repo = PatientRepository(db)
        self.medication_repo = MedicationRepository(db)
        self.wellness_repo = WellnessRepository(db)
        self.report_repo = ReportRepository(db)

    def join_patient(self, user_id: int, invite_code: str) -> dict:
        """
        Link a caregiver to a patient via invite code.

        Returns:
            Success message.
        """
        caregiver = self.caregiver_repo.get_by_user_id(user_id)
        if not caregiver:
            raise NotFoundException(message="Caregiver profile not found.")

        link = self.caregiver_repo.get_link_by_invite_code(invite_code)
        if not link:
            raise BadRequestException(message="Invalid invite code.")

        if link.status == "accepted":
            raise BadRequestException(message="Invite code has already been used.")

        # Update the link with actual caregiver ID
        link.caregiver_id = caregiver.id
        link.status = "accepted"
        self.caregiver_repo.db.commit()

        return {"message": "Successfully linked to patient."}

    def get_dashboard(self, user_id: int) -> dict:
        """
        Get caregiver dashboard data for linked patients.

        Returns:
            Dict with linked patient overview, wellness status, adherence, and medical reports.
        """
        caregiver = self.caregiver_repo.get_by_user_id(user_id)
        if not caregiver:
            raise NotFoundException(message="Caregiver profile not found.")

        links = self.caregiver_repo.get_patients_for_caregiver(caregiver.id)
        if not links:
            return {
                "patient_name": "No patient linked",
                "medication_adherence": 0,
                "today_status": "No check-in",
                "linked_patients": [],
                "medical_reports": [],
            }

        linked_patients = []
        for link in links:
            p = self.patient_repo.get_by_id(link.patient_id)
            if p:
                linked_patients.append({
                    "patient_id": p.id,
                    "name": p.user.full_name,
                    "age": p.age,
                    "blood_group": p.blood_group,
                })

        primary_patient_id = links[0].patient_id
        primary_patient = self.patient_repo.get_by_id(primary_patient_id)
        if not primary_patient:
            raise NotFoundException(message="Patient profile not found.")

        # Medication Adherence
        medications = self.medication_repo.get_by_patient_id(primary_patient.id)
        logs = self.medication_repo.get_logs_by_patient(primary_patient.id)
        total_meds = len(medications) if medications else 1
        taken_logs = len([l for l in logs if l.status == "taken"])
        adherence = round((taken_logs / max(total_meds, 1)) * 100, 1)

        # Latest Wellness Check
        latest_wellness = self.wellness_repo.get_latest(primary_patient.id)
        today_status = latest_wellness.mood if latest_wellness else "No check-in"

        # Synced Medical Reports
        reports = self.report_repo.get_by_patient_id(primary_patient.id)
        medical_reports = [
            {
                "id": r.id,
                "report_name": r.report_name,
                "report_url": r.report_url,
                "ai_summary": r.ai_summary,
                "uploaded_at": r.uploaded_at.isoformat() if r.uploaded_at else None,
            }
            for r in reports
        ]

        return {
            "patient_id": primary_patient.id,
            "patient_name": primary_patient.user.full_name,
            "age": primary_patient.age,
            "blood_group": primary_patient.blood_group,
            "medication_adherence": adherence,
            "today_status": today_status,
            "wellness_summary": {
                "mood": latest_wellness.mood if latest_wellness else "No check-in",
                "sleep_hours": latest_wellness.sleep_hours if latest_wellness else None,
                "energy_level": latest_wellness.energy_level if latest_wellness else None,
                "pain_level": latest_wellness.pain_level if latest_wellness else None,
                "notes": latest_wellness.notes if latest_wellness else None,
                "created_at": latest_wellness.created_at.isoformat() if latest_wellness and latest_wellness.created_at else None,
            } if latest_wellness else None,
            "linked_patients": linked_patients,
            "medical_reports": medical_reports,
        }

    def get_patient_details(self, user_id: int, patient_id: int) -> dict:
        """Get detailed patient info for caregiver view."""
        caregiver = self.caregiver_repo.get_by_user_id(user_id)
        if not caregiver:
            raise NotFoundException(message="Caregiver profile not found.")

        patient = self.patient_repo.get_by_id(patient_id)
        if not patient:
            raise NotFoundException(message="Patient not found.")

        reports = self.report_repo.get_by_patient_id(patient.id)
        medical_reports = [
            {
                "id": r.id,
                "report_name": r.report_name,
                "report_url": r.report_url,
                "ai_summary": r.ai_summary,
                "uploaded_at": r.uploaded_at.isoformat() if r.uploaded_at else None,
            }
            for r in reports
        ]

        return {
            "id": patient.id,
            "name": patient.user.full_name,
            "age": patient.age,
            "blood_group": patient.blood_group,
            "medical_reports": medical_reports,
        }

    def _get_linked_patient_id(self, caregiver_user_id: int, patient_id: int | None = None) -> int:
        """Verify caregiver profile and get linked patient ID."""
        caregiver = self.caregiver_repo.get_by_user_id(caregiver_user_id)
        if not caregiver:
            raise NotFoundException(message="Caregiver profile not found.")

        links = self.caregiver_repo.get_patients_for_caregiver(caregiver.id)
        if not links:
            raise BadRequestException(message="No patient linked to this caregiver.")

        if patient_id:
            # Check specific link
            link = next((l for l in links if l.patient_id == patient_id), None)
            if not link:
                raise BadRequestException(message="Patient is not linked to this caregiver.")
            return link.patient_id

        return links[0].patient_id

    def get_patient_medications(self, caregiver_user_id: int, patient_id: int | None = None) -> list[dict]:
        """Get medication schedule for linked patient."""
        target_patient_id = self._get_linked_patient_id(caregiver_user_id, patient_id)
        medications = self.medication_repo.get_by_patient_id(target_patient_id)
        return [
            {
                "id": m.id,
                "name": m.medicine_name,
                "dosage": m.dosage,
                "time": m.reminder_time.strftime("%H:%M") if m.reminder_time else None,
                "status": self.medication_repo.get_latest_status(m.id),
                "frequency": m.frequency or "Daily",
                "instructions": m.instructions or "",
            }
            for m in medications
        ]

    def add_patient_medication(self, caregiver_user_id: int, patient_id: int | None = None, name: str = "", **kwargs) -> dict:
        """Caregiver creates a medication schedule for linked patient."""
        target_patient_id = self._get_linked_patient_id(caregiver_user_id, patient_id)

        med = self.medication_repo.create(patient_id=target_patient_id, medicine_name=name, **kwargs)

        from app.repositories.activity_repository import ActivityRepository
        ActivityRepository(self.patient_repo.db).create_log(
            patient_id=target_patient_id,
            event_type="medication",
            title=f"Medication Scheduled by Caregiver: {name}",
            description=f"Dosage: {kwargs.get('dosage', 'N/A')}",
        )

        return {
            "id": med.id,
            "name": med.medicine_name,
            "dosage": med.dosage,
            "time": med.reminder_time.strftime("%H:%M") if med.reminder_time else None,
            "status": "pending",
            "frequency": med.frequency or "Daily",
            "instructions": med.instructions or "",
        }

    def update_patient_medication(self, caregiver_user_id: int, medication_id: int, **kwargs) -> dict:
        """Caregiver updates a medication schedule."""
        medication = self.medication_repo.get_by_id(medication_id)
        if not medication:
            raise NotFoundException(message="Medication not found.")

        self._get_linked_patient_id(caregiver_user_id, medication.patient_id)

        if "name" in kwargs and kwargs["name"]:
            kwargs["medicine_name"] = kwargs.pop("name")
        else:
            kwargs.pop("name", None)

        medication = self.medication_repo.update(medication, **kwargs)
        return {
            "id": medication.id,
            "name": medication.medicine_name,
            "dosage": medication.dosage,
            "time": medication.reminder_time.strftime("%H:%M") if medication.reminder_time else None,
            "status": "pending",
            "frequency": medication.frequency or "Daily",
            "instructions": medication.instructions or "",
        }

    def delete_patient_medication(self, caregiver_user_id: int, medication_id: int) -> None:
        """Caregiver deletes a medication schedule."""
        medication = self.medication_repo.get_by_id(medication_id)
        if not medication:
            raise NotFoundException(message="Medication not found.")

        self._get_linked_patient_id(caregiver_user_id, medication.patient_id)
        self.medication_repo.delete(medication)

    def get_patient_activity(self, caregiver_user_id: int) -> list[dict]:
        """Get recent activity timeline feed for caregiver dashboard."""
        patient_id = self._get_linked_patient_id(caregiver_user_id)
        from app.repositories.activity_repository import ActivityRepository
        activity_repo = ActivityRepository(self.patient_repo.db)
        logs = activity_repo.get_patient_activity(patient_id, limit=30)

        return [
            {
                "id": a.id,
                "event_type": a.event_type,
                "title": a.title,
                "description": a.description,
                "created_at": a.created_at.isoformat() if a.created_at else None,
            }
            for a in logs
        ]

    def get_patient_wellness(self, caregiver_user_id: int) -> list[dict]:
        """Get wellness check history for caregiver view."""
        patient_id = self._get_linked_patient_id(caregiver_user_id)
        checks = self.wellness_repo.get_by_patient_id(patient_id)

        return [
            {
                "id": c.id,
                "mood": c.mood,
                "sleep_hours": c.sleep_hours,
                "energy_level": c.energy_level,
                "pain_level": c.pain_level,
                "notes": c.notes,
                "created_at": c.created_at.isoformat() if c.created_at else None,
            }
            for c in checks
        ]
