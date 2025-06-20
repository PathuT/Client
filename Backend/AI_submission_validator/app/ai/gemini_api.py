import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the model properly
model = genai.GenerativeModel(model_name="models/gemini-2.0-flash")

def query_gemini(context: str, submission: str) -> str:
    prompt = f"""
You are evaluating student submissions vs trusted content.

CONTEXT:
{context}

SUBMISSION:
{submission}

Provide:
- authenticity_score (0–100)
- flags (list)
- explanation
Return as JSON.
"""
    try:
        response = model.generate_content(prompt)
        return response.text.strip() if response else "No response"
    except Exception as e:
        return f"Gemini API Error: {str(e)}"
