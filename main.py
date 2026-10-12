from fastapi import FastAPI #We are importing FastAPI from the FastAPI package.
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel #FastAPI uses Pydantic to validate the data coming into our API
from dotenv import load_dotenv #Allows Python to read the .env file.
from google import genai
from fastapi.responses import FileResponse #to access html
from fastapi.staticfiles import StaticFiles #to access css and js

import os#Allows Python to access environment variables

load_dotenv() #Loads the variables from .env

app = FastAPI() #create our FastAPI application

app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))#This reads your Gemini key from

@app.get("/") #creates an API endpoint
def home(): #Python function that will run
   return FileResponse("frontend/index.html")

class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
def chat(request: ChatRequest):

    #This sends your message to Gemini
    response = client.models.generate_content(
       model="gemini-3.1-flash-lite",
        contents=request.message
    )

    return {
        "reply": response.text
    }