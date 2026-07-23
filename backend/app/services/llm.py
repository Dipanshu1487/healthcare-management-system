import logging

logger = logging.getLogger("app")

class LLMProviderInterface:
    @staticmethod
    async def generate_response(prompt: str, provider: str = "openai") -> str:
        """Process prompts and yield text using requested provider."""
        logger.info(f"Invoking LLM response via provider: {provider}")
        
        # Simulated responses reflecting RAG configurations
        if "Abnormal" in prompt or "Lab Report" in prompt:
            return (
                "Based on the retrieved Laboratory test records, the patient's Hb level is 9.2 g/dL, "
                "which indicates mild anemia. Compare this with normal pregnancy ranges (11-14 g/dL)."
            )
        elif "Consultation" in prompt:
            return (
                "Drafted Clinical Notes:\n"
                "Subjective: Patient reports mild headaches and fatigue.\n"
                "Objective: BP: 130/85 mmHg, Temp: 98.6F.\n"
                "Assessment: Mild gestational hypertension check needed."
            )
        elif "SOP" in prompt:
            return (
                "According to CHC Bharno Admission SOP Section 3.1:\n"
                "All new patients must present a valid Aadhaar or ration card for PM-JAY registration at counter 1."
            )
            
        return "This is a context-aware RAG generated response matching hospital reference schemas."
