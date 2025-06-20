from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import sys
import os

# Ensure the app directory is in the path
sys.path.append(os.path.join(os.path.dirname(__file__), './app'))

from app.utils.doc_utils import extract_text_from_pdf, extract_text_from_image
from app.ai.pipeline import run_agents

app = FastAPI()

# Allow all CORS origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/validate")
async def validate_submission(
    text_input: str = Form(None),
    submission_file: UploadFile = File(None),
    reference_file: UploadFile = File(None),
):
    try:
        submit_text = ""
        img = None

        # Handle submission file
        if submission_file:
            if submission_file.content_type == "application/pdf":
                submit_text = extract_text_from_pdf(submission_file.file)
            else:
                img_data = await submission_file.read()
                img = Image.open(io.BytesIO(img_data))
                submit_text = extract_text_from_image(img)

        # Fallback to raw text input
        elif text_input:
            submit_text = text_input.strip()

        if not submit_text:
            return {"error": "Please provide a submission via file or text"}

        # Handle reference file
        ref_file_obj = None
        if reference_file:
            ref_file_obj = io.BytesIO(await reference_file.read())
            ref_file_obj.name = reference_file.filename

        # Run the AI pipeline
        result = run_agents(submit_text, ref_file_obj, img)

        # Shape response similar to Streamlit
        return {
            "success": True,
            "plagiarism": result.get("plagiarism", False),
            "parsed": result.get("parsed", {}),
            "credential": result.get("credential", None)
        }

    except Exception as e:
        return {"error": str(e)}
