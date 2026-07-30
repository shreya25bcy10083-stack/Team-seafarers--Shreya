Read FINAL_RELEASE_BLOCKERS.md before making any changes.

These are not UI bugs—they indicate incorrect data relationships between patients and caregivers.

First inspect the database models, API endpoints, repositories, and dashboard queries to identify why both dashboards are not referencing the same patient record.

Fix the underlying relationship logic rather than patching the UI.

Do not implement new features. Focus only on making the patient and caregiver operate on the same shared patient data.
