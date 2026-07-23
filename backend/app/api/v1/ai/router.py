from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.database.session import get_db
from app.services.rag import RAGService
from app.services.llm import LLMProviderInterface
from app.services.audit import AuditService
from app.api.deps import get_current_active_user
from app.models.user import User
from app.utils.responses import success_response

router = APIRouter(prefix="/ai", tags=["Enterprise AI Assistant"])

class ChatRequest(BaseModel):
    prompt: str
    role: str

@router.post("/chat")
async def chat_ai(
    payload: ChatRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    # Retrieve semantic context matching request permissions
    sources = await RAGService.retrieve_context(payload.prompt, payload.role)
    
    # Construct security-hardened prompt
    context_str = "\n".join([f"- [{s['category']}] {s['title']}" for s in sources])
    prompt = (
        f"Context:\n{context_str}\n\n"
        f"Role: {payload.role}\n"
        f"Question: {payload.prompt}"
    )
    
    answer = await LLMProviderInterface.generate_response(prompt)

    # Auditing RAG access logs
    audit = AuditService(db)
    await audit.log_action(
        actor_role=payload.role,
        actor_name=user.username,
        action="RAG_AI_CHAT",
        entity_type="System",
        entity_id="N/A",
        description=f"AI chat request: '{payload.prompt[:40]}...'"
    )
    await db.commit()

    return success_response(
        data={
            "answer": answer,
            "sources": sources
        },
        message="AI response generated successfully"
    )
