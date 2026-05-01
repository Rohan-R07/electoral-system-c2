from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ai_engine import generate_steps, explain_step, chat_reply

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Request(BaseModel):
    text: str


@app.post("/steps")
def steps(req: Request):
    return {"steps": generate_steps(req.text)}


@app.post("/explain")
def explain(req: Request):
    return {"explanation": explain_step(req.text)}


@app.post("/chat")
def chat(req: Request):
    return {"reply": chat_reply(req.text)}
