import hashlib
import os
from app.ai.langchain_api import parse_submission, detect_plagiarism, validate_credential
from app.utils.retriever import load_corpus
from langchain.agents import initialize_agent, Tool
from langchain_google_genai import ChatGoogleGenerativeAI  

RAG_FOLDER = "rag_corpus"
os.makedirs(RAG_FOLDER, exist_ok=True)

def save_unique_submission_to_rag(subm_text: str, title: str):
    # hash the content to avoid filename collisions
    hash_val = hashlib.md5(subm_text.encode()).hexdigest()
    filename = f"{title[:50]}_{hash_val}.txt"
    path = os.path.join(RAG_FOLDER, filename)

    with open(path, "w", encoding="utf-8") as f:
        f.write(subm_text)

def run_agents(subm_text: str, reference_file=None, img=None):
    texts, _ = load_corpus(RAG_FOLDER)

    out = {}
    parsed = parse_submission(subm_text, img)
    out['parsed'] = parsed

    # Plagiarism check (offline with RAG)
    plag = detect_plagiarism(subm_text, texts)
    out['plagiarism'] = plag

    # Save to RAG if new
    if not plag:
        save_unique_submission_to_rag(subm_text, parsed.get('title') or "submission")

    # Credential validation (if certificate provided)
    if reference_file:
        out['credential'] = validate_credential(subm_text, reference_file)
    else:
        out['credential'] = None

    # Web Validation (heuristic with Gemini)
    try:
        # Define a placeholder tool (required for LangChain agent)
        def dummy_tool(_): return "Tool not used."

        tools = [
            Tool(
                name="WebValidationTool",
                func=dummy_tool,
                description="Heuristically evaluates submission for ghostwriting or outdated content"
            )
        ]

        llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0)

        agent = initialize_agent(
            tools,
            llm,
            agent="zero-shot-react-description",
            verbose=False
        )
#Prompt for the output structure only
        prompt = f"""
Analyze the student submission below and assess if:
- The content is ghostwritten or copied from web sources.
- It contains outdated facts.
- It appears auto-generated or generic.

Respond with a short, plain-text risk assessment.

Submission:
{subm_text}
"""
        web_validation = agent.run(prompt)
        out['web_validation'] = web_validation
    except Exception as e:
        out['web_validation'] = f"Web validation failed: {str(e)}"

    return out
