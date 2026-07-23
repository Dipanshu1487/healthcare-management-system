import asyncio
import logging
from typing import Dict, List, Callable, Any, Awaitable

logger = logging.getLogger(__name__)

class EventBus:
    def __init__(self):
        self._listeners: Dict[str, List[Callable[[Dict[str, Any]], Awaitable[None]]]] = {}

    def subscribe(self, event_type: str, listener: Callable[[Dict[str, Any]], Awaitable[None]]):
        if event_type not in self._listeners:
            self._listeners[event_type] = []
        self._listeners[event_type].append(listener)
        logger.info(f"Subscribed new listener to event type: '{event_type}'")

    async def publish(self, event_type: str, payload: Dict[str, Any]):
        if event_type not in self._listeners:
            return

        listeners = self._listeners[event_type]
        logger.info(f"Publishing event '{event_type}' to {len(listeners)} listeners")
        
        # Fire all listeners concurrently without blocking the main workflow
        tasks = []
        for listener in listeners:
            tasks.append(self._run_safely(listener, payload))
        await asyncio.gather(*tasks)

    async def _run_safely(self, listener: Callable[[Dict[str, Any]], Awaitable[None]], payload: Dict[str, Any]):
        try:
            await listener(payload)
        except Exception as e:
            logger.error(f"Error executing listener: {str(e)}", exc_info=True)

# Global Event Bus Instance
event_bus = EventBus()
