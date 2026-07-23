from typing import List, Dict, Any

class RAGService:
    @staticmethod
    async def retrieve_context(query: str, role: str) -> List[Dict[str, Any]]:
        """Retrieve relevant context documents matching role security privileges."""
        sources = []
        
        # Role based source matching
        if role == "doctor":
            sources.append({"title": "Patient Clinical Record P-102", "category": "Patient Record"})
            if "slot" in query.lower() or "free" in query.lower() or "schedule" in query.lower():
                sources.append({"title": "Next free OPD slot: July 16, 2026 at 11:30 AM", "category": "Schedule Availability"})
            elif "lab" in query.lower() or "report" in query.lower():
                sources.append({"title": "Haemogram Report - 12/07/26", "category": "Lab Report"})
            else:
                sources.append({"title": "WHO Hypertension Guidelines", "category": "WHO Guideline"})
        elif role == "reception" or role == "receptionist":
            if "earliest" in query.lower() or "available" in query.lower() or "appointment" in query.lower():
                sources.append({"title": "Earliest General Medicine opening: Today at 10:45 AM with Dr. Priya Sharma", "category": "Schedule Availability"})
            sources.append({"title": "OPD Registration SOP v2", "category": "Hospital SOP"})
            sources.append({"title": "Ayushman Bharat PM-JAY Policy", "category": "State Scheme"})
        elif role == "admin" or role == "hospital administrator":
            if "lightest" in query.lower() or "workload" in query.lower() or "doctors" in query.lower():
                sources.append({"title": "Workload summary: Dr. Ramesh Gupta (14 slots), Dr. Priya Sharma (18 slots)", "category": "Admin Analytics"})
            sources.append({"title": "Hospital Roster Policy v1", "category": "Hospital SOP"})
        elif role == "lab":
            sources.append({"title": "Haemology SOP manual", "category": "Laboratory SOP"})
        elif role == "pharmacy":
            sources.append({"title": "National Essential Medicines list", "category": "Drug Formulary"})
            
        # Fallback default source
        if not sources:
            sources.append({"title": "CHC FAQ Handbook", "category": "Hospital Policy"})
            
        return sources
