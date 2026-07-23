import io

class PDFGeneratorService:
    @staticmethod
    def generate_prescription_pdf(
        patient_name: str,
        uhid: str,
        doctor_name: str,
        diagnosis: str,
        items: list
    ) -> bytes:
        """Generate clinical prescription sheet representation."""
        buffer = io.BytesIO()
        # Simulation bytes layout resembling a PDF document
        buffer.write(b"%PDF-1.4\n")
        buffer.write(f"Hospital: CHC Bharno\nPatient: {patient_name} ({uhid})\n".encode())
        buffer.write(f"Doctor: {doctor_name}\nDiagnosis: {diagnosis}\n".encode())
        buffer.write(b"Items:\n")
        for item in items:
            buffer.write(f"- {item.get('name')}: {item.get('dosage')} x {item.get('duration')}\n".encode())
        buffer.write(b"%%EOF\n")
        return buffer.getvalue()

    @staticmethod
    def generate_lab_report_pdf(
        patient_name: str,
        uhid: str,
        test_name: str,
        result_value: str,
        normal_range: str,
        remarks: str
    ) -> bytes:
        """Generate pathology laboratory report printout representation."""
        buffer = io.BytesIO()
        buffer.write(b"%PDF-1.4\n")
        buffer.write(f"Hospital: CHC Bharno Lab\nPatient: {patient_name} ({uhid})\n".encode())
        buffer.write(f"Test: {test_name}\nResult: {result_value} (Normal: {normal_range})\n".encode())
        buffer.write(f"Remarks: {remarks}\n".encode())
        buffer.write(b"%%EOF\n")
        return buffer.getvalue()

    @staticmethod
    def generate_bill_pdf(
        patient_name: str,
        uhid: str,
        invoice_no: str,
        total_amount: float
    ) -> bytes:
        """Generate invoice billing sheet representation."""
        buffer = io.BytesIO()
        buffer.write(b"%PDF-1.4\n")
        buffer.write(f"Hospital: CHC Bharno Billing\nPatient: {patient_name} ({uhid})\n".encode())
        buffer.write(f"Invoice: {invoice_no}\nTotal Amount: INR {total_amount}\n".encode())
        buffer.write(b"%%EOF\n")
        return buffer.getvalue()
