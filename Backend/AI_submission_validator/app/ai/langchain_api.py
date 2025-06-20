from app.utils.doc_utils import extract_text_from_image, scan_qr_from_image
from app.utils.score_utils import interpret_score
from app.utils.retriever import load_corpus, build_faiss, retrieve
from app.ai.gemini_api import query_gemini
from langchain.agents import initialize_agent, Tool
from langchain_google_genai import ChatGoogleGenerativeAI
import os
import shutil

RAG_FOLDER = "rag_corpus"
os.makedirs(RAG_FOLDER, exist_ok=True)

# 1. Submission Parsing Agent
def parse_submission(subm_text: str, img=None):
    metadata = {}
    if img:
        metadata['qr_data'] = scan_qr_from_image(img)
    lines = subm_text.splitlines()
    metadata['title'] = lines[0] if lines else ""
    return metadata

# 2. Plagiarism Agent
def detect_plagiarism(subm_text: str, corpus_texts: list[str]):
    reuses = [t for t in corpus_texts if subm_text.strip() == t.strip()]
    return bool(reuses)

# 3. Credential Validation Agent (RAG + Gemini)
def validate_credential(subm_text: str, reference_file):
    # Save reference and rebuild index
    dest = os.path.join(RAG_FOLDER, os.path.basename(reference_file.name))
    reference_file.seek(0)
    with open(dest, "wb") as w:
        w.write(reference_file.read())

    texts, names = load_corpus(RAG_FOLDER)
    index, embeds = build_faiss(texts)
    top, score = retrieve(subm_text, index, texts, k=1)[0]

    label = interpret_score(score)
    gemini_resp = query_gemini(top, subm_text)

    return {
        "matched": top[:500],
        "similarity": score,
        "label": label,
        "gemini": gemini_resp
    }

# 4. Web Validation Agent (LangChain + Gemini)
from langchain.agents import initialize_agent, Tool
from langchain_google_genai import ChatGoogleGenerativeAI

def web_validate_submission(subm_text: str) -> str:
    """
    Use LangChain Gemini agent to heuristically evaluate the submission content.
    """
    try:
# 5. Define a simple tool wrapper ( can be extended later)
        def dummy_tool(_):
            return "Tool executed."

        tool = Tool(
            name="Web Validation Tool",
            func=dummy_tool,
            description="Evaluates a submission for ghostwriting, outdated info, and AI-generated content."
        )

        # Initialize Gemini LLM
        llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0)

# 6 Defining agent
        agent = initialize_agent(
            tools=[tool],
            llm=llm,
            agent="zero-shot-react-description",
            verbose=False
        )

        # Query
        prompt = f"""
Evaluate this student submission for:
- signs of ghostwriting,
- outdated information,
- auto-generated content.

Returns brief plain-text analysis.

Submission:
{subm_text}
"""

        return agent.run(prompt)

    except Exception as e:
        return f"Web validation failed: {str(e)}"
