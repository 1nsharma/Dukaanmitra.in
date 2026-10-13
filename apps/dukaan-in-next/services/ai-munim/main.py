import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from typing import List, Optional

app = FastAPI(title="DukaanMitra AI Munim Service")

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    reasoning: Optional[str] = None

class PubSubMessage(BaseModel):
    message: dict

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # This will eventually connect to the "Own LLM" (Llama 3 / Mistral)
    # For now, it acts as a placeholder for the autonomous AI agent
    try:
        # Placeholder logic
        return ChatResponse(
            response=f"AI Munim received: {request.message}. I am preparing to manage your Dukaan autonomously.",
            reasoning="Processing store management request via own LLM infrastructure."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/pubsub")
async def handle_pubsub(request: PubSubMessage):
    """
    Handles Firestore events pushed via Pub/Sub.
    Expects a message with base64 encoded data.
    """
    if not request.message or 'data' not in request.message:
        raise HTTPException(status_code=400, detail="Invalid Pub/Sub message format")

    try:
        import base64
        import json
        
        # Decode the Pub/Sub data
        data_str = base64.b64decode(request.message['data']).decode('utf-8')
        event_data = json.loads(data_str)
        
        print(f"Received Firestore Event: {event_data.get('eventType')}")
        
        # Logic for the AI Munim to process the event
        # e.g., Update accounting, send WhatsApp reminder, etc.
        await process_firestore_event(event_data)
        
        return {"status": "ok", "processed": True}
    except Exception as e:
        print(f"Error processing Pub/Sub message: {e}")
        # Return 200 to avoid Pub/Sub retries if it's a data error, 
        # or 500 if we want a retry.
        return {"status": "error", "message": str(e)}

async def process_firestore_event(event: dict):
    # This is where the "Autonomous" logic lives
    # For now, we log the event type
    event_type = event.get('eventType', 'unknown')
    shop_id = event.get('shopId', 'unknown')
    print(f"Processing {event_type} for shop {shop_id}...")
    # Trigger LLM reasoning if needed...

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)
