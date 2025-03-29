import os
import asyncio
import uvicorn
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from data import personal_data, projects

load_dotenv()

app = FastAPI()

# Allow cross-origin requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://portfolio-websiteavinashmadnani.vercel.app/interview"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model for chat messages
class ChatMessage(BaseModel):
    message: str

# Helper function to query the Hugging Face Inference API
def query_huggingface_api(prompt: str) -> str:
    api_token = os.environ.get("HUGGINGFACE_API_TOKEN")
    if not api_token:
        return "API token not set. Please configure HUGGINGFACE_API_TOKEN."
    
    headers = {"Authorization": f"Bearer {api_token}"}
    payload = {"inputs": prompt}
    API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
                return data[0]["generated_text"]
            else:
                return "Sorry, I couldn't generate a response."
        else:
            return f"Error: {response.status_code} - {response.text}"
    except Exception as e:
        return f"An exception occurred: {str(e)}"

# Functions to handle specific queries
def handle_personal_query():
    return f"My name is {personal_data['name']}. {personal_data['bio']} You can reach me at {personal_data['contact']}."

def list_projects():
    project_list = "\n".join([f"{p['name']}: {p['description']}" for p in projects])
    return f"Here are my projects:\n{project_list}"

def get_project_details(project_name: str):
    for p in projects:
        if p['name'].lower() == project_name.lower():
            return f"{p['name']} details: {p['details']}. More info: {p['link']}"
    return "Sorry, I couldn't find details for that project."

# Chat endpoint: process message based on query content
@app.post("/chat")
async def chat(message: ChatMessage):
    await asyncio.sleep(0.5)  # Simulate processing delay
    prompt = message.message.lower()
    if "who are you" in prompt or "tell me about yourself" in prompt:
        response_text = handle_personal_query()
    elif "project list" in prompt or "list projects" in prompt:
        response_text = list_projects()
    elif "tell me more for" in prompt:
        # Expected format: "tell me more for ProjectX"
        parts = prompt.split("tell me more for")
        if len(parts) > 1:
            project_query = parts[1].strip()
            response_text = get_project_details(project_query)
        else:
            response_text = "Please specify which project you'd like to know more about."
    else:
        response_text = query_huggingface_api(message.message)
    return {"response": response_text}

if __name__ == "__main__":
    uvicorn.run(app, port=8001)


# ... (previous imports)
# import os
# import json
# import asyncio
# import uvicorn
# import requests
# from pathlib import Path
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from dotenv import load_dotenv
# from typing import Union

# load_dotenv()

# app = FastAPI()

# # Allow cross-origin requests from the frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173"],  # For production, restrict this to your frontend URL
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load personal data
# data_path = Path(__file__).parent / "data.json"
# personal_data = json.loads(data_path.read_text())

# def handle_special_intents(message: str) -> Union[str, None]:
#     message = message.lower().strip()
    
#     # Check for about intent
#     if any(q in message for q in ["who are you", "about you", "tell me about yourself"]):
#         return personal_data["about"]
    
#     # Check for projects list
#     if any(q in message for q in ["projects", "your work", "what have you built"]):
#         projects_list = "\n".join([f"- {p['name']}: {p['summary']}" for p in personal_data["projects"]])
#         return f"My projects:\n{projects_list}\nAsk about a specific project for more details!"
    
#     # Check for project details
#     if "tell me more about" in message:
#         project_name = message.split("about")[-1].strip()
#         for project in personal_data["projects"]:
#             if project["name"].lower() == project_name:
#                 details = f"{project['name']}:\n{project['details']}\nTechnologies: {', '.join(project['technologies'])}"
#                 if project["link"]:
#                     details += f"\nLink: {project['link']}"
#                 return details
#         return "Sorry, I couldn't find that project."
    
#     return None

# # Request model for chat messages
# class ChatMessage(BaseModel):
#     message: str

# # Helper function to query the Hugging Face Inference API
# def query_huggingface_api(prompt: str) -> str:
#     api_token = os.environ.get("HUGGINGFACE_API_TOKEN")
#     if not api_token:
#         return "API token not set. Please configure HUGGINGFACE_API_TOKEN."
    
#     headers = {"Authorization": f"Bearer {api_token}"}
#     payload = {"inputs": prompt}
#     API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium"
    
#     try:
#         response = requests.post(API_URL, headers=headers, json=payload, timeout=10)
#         if response.status_code == 200:
#             data = response.json()
#             if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
#                 return data[0]["generated_text"]
#             else:
#                 return "Sorry, I couldn't generate a response."
#         else:
#             return f"Error: {response.status_code} - {response.text}"
#     except Exception as e:
#         return f"An exception occurred: {str(e)}"

# # Chat endpoint: uses special intents first and falls back to the Hugging Face API.
# @app.post("/chat")
# async def chat(message: ChatMessage):
#     special_response = handle_special_intents(message.message)
#     if special_response:
#         return {"response": special_response}
    
#     # Small artificial delay to simulate processing (and ensure responsiveness)
#     await asyncio.sleep(0.5)
#     response_text = query_huggingface_api(message.message)
#     return {"response": response_text}

# if __name__ == "__main__":
#     uvicorn.run(app, port=8000)
