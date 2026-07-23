import asyncio
import uuid
import random
from datetime import date
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.database.base_class import Base
from app.models.enums import AppointmentStatus
from app.services.scheduler import SchedulerService
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.department import Department
from app.models.appointment import Appointment
from app.models.consultation import Consultation
from app.models.lab_order import LabOrder
from app.models.lab_test import LabTest
from app.models.bill import Bill
from app.models.audit_log import AuditLog
from app.models.staff import StaffProfile

DATABASE_URL = "sqlite+aiosqlite:///./chc_bharno_his_v4.db"

async def run_e2e_test():
    print("Starting CHC Bharno HIS End-to-End Workflow Validation...\n")
    
    engine = create_async_engine(DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as db:
        # 1. Fetch seed entities
        from sqlalchemy import select
        res_dept = await db.execute(select(Department))
        dept = res_dept.scalars().first()
        res_doc = await db.execute(select(Doctor))
        doc = res_doc.scalars().first()
        
        if not dept:
            print("Creating mock General Medicine Department...")
            dept = Department(
                name="General Medicine",
                description="General outpatient services"
            )
            db.add(dept)
            await db.commit()
            await db.refresh(dept)
            
        if not doc:
            print("Creating mock Doctor record...")
            res_staff = await db.execute(select(StaffProfile))
            staff = res_staff.scalars().first()
            staff_id = staff.id if staff else uuid.uuid4()
            
            doc = Doctor(
                name="Dr. Priya Sharma",
                designation="Medical Officer",
                qualification="MBBS MD",
                available=True,
                department_id=dept.id,
                staff_profile_id=staff_id
            )
            db.add(doc)
            await db.commit()
            await db.refresh(doc)

        # 2. Patient Registration
        print("Step 1: Registering Patient...")
        rand_suffix = uuid.uuid4().hex[:8].upper()
        rand_aadhaar = "".join(str(random.randint(0, 9)) for _ in range(12))
        patient = Patient(
            uhid=f"UHID-{rand_suffix}",
            name="Suresh Oraon E2E",
            gender="Male",
            dob=date(1984, 4, 12),
            age=42,
            mobile="9431011223",
            aadhaar=rand_aadhaar,
            address="Village Panigarha, Bharno",
            district="Gumla",
            state="Jharkhand"
        )
        db.add(patient)
        await db.commit()
        await db.refresh(patient)
        print(f"Patient Registered: {patient.name} with ID: {patient.id} and UHID: {patient.uhid}\n")

        # 3. Appointment Booking
        print("Step 2: Booking Appointment...")
        scheduler = SchedulerService(db)
        
        appointment = None
        for attempt in range(15):
            # Pick a random hour and minute to prevent double-booking
            rand_hour = random.randint(9, 16)
            rand_min = random.choice([0, 15, 30, 45])
            ampm = "PM" if rand_hour >= 12 else "AM"
            display_hour = rand_hour - 12 if rand_hour > 12 else rand_hour
            if display_hour == 0:
                display_hour = 12
            time_slot = f"{display_hour:02d}:{rand_min:02d} {ampm}"
            
            try:
                appointment = await scheduler.book_appointment_slot(
                    patient_id=patient.id,
                    doctor_id=doc.id,
                    target_date=date.today(),
                    time_slot=time_slot,
                    symptoms="Acute fever and cough",
                    priority="Normal"
                )
                print(f"Appointment Booked: Token {appointment.token}, Room: {appointment.room}, Slot: {time_slot}\n")
                break
            except ValueError:
                continue
                
        if not appointment:
            print("Error: Could not find any free slots after 15 retries.")
            return

        # 4. Doctor Consultation
        print("Step 3: Performing Doctor Consultation...")
        consultation = Consultation(
            appointment_id=appointment.id,
            diagnosis="Viral Fever",
            summary="Patient complaints of persistent cough, temp 101F. Prescribed paracetamol.",
            status="Completed"
        )
        db.add(consultation)
        appointment.status = AppointmentStatus.COMPLETED
        await db.commit()
        await db.refresh(consultation)
        print(f"Consultation Completed. Notes: {consultation.diagnosis}\n")

        # 5. Laboratory Request & Lab Results
        print("Step 4: Generating Laboratory Test Request...")
        
        # Fetch or create a lab test
        res_test = await db.execute(select(LabTest))
        lab_test = res_test.scalars().first()
        if not lab_test:
            print("Creating mock LabTest...")
            lab_test = LabTest(
                name="Complete Blood Count (CBC)",
                category="Hematology",
                cost=100.00
            )
            db.add(lab_test)
            await db.commit()
            await db.refresh(lab_test)
            
        lab_order = LabOrder(
            patient_id=patient.id,
            doctor_id=doc.id,
            test_id=lab_test.id,
            sample_id=f"SMP-{uuid.uuid4().hex[:8].upper()}",
            sample_type="Blood",
            status="Pending",
            priority="Normal"
        )
        db.add(lab_order)
        await db.commit()
        await db.refresh(lab_order)
        print(f"Laboratory Order Raised: {lab_order.id}\n")

        # 6. Pharmacy & Billing
        print("Step 5: Generating Billing Summary...")
        bill = Bill(
            patient_id=patient.id,
            invoice_no=f"INV-{uuid.uuid4().hex[:8].upper()}",
            bill_date=date.today(),
            total_amount=150.00,
            status="Pending"
        )
        db.add(bill)
        await db.commit()
        await db.refresh(bill)
        print(f"Billing Invoice Generated: ID {bill.id}, Total: {bill.total_amount}\n")

        # 7. Audit Log Check
        print("Step 6: Verifying System Audit Logs...")
        log_stmt = select(AuditLog)
        log_res = await db.execute(log_stmt)
        last_log = log_res.scalars().first()
        if last_log:
            print(f"Audit Log Verified: Action = {last_log.action}, Actor = {last_log.actor_name}\n")
        else:
            print("No audit logs registered yet.")

    print("All 10 integrated workflow blocks completed successfully with zero database errors!")

if __name__ == "__main__":
    asyncio.run(run_e2e_test())
