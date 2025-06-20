import os
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

MODEL_NAME = "all-MiniLM-L6-v2"
model = SentenceTransformer(MODEL_NAME)

def load_corpus(folder: str):
    texts, names = [], []
    for fname in os.listdir(folder):
        if fname.endswith(".txt") or fname.endswith(".pdf") or fname.endswith(".png") or fname.endswith(".jpg"):
            with open(os.path.join(folder, fname), "r", encoding="utf-8", errors="ignore") as f:
                texts.append(f.read())
                names.append(fname)
    return texts, names

def build_faiss(texts: list[str]):
    embeds = model.encode(texts, convert_to_numpy=True)
    dim = embeds.shape[1]
    idx = faiss.IndexFlatIP(dim)
    idx.add(embeds.astype("float32"))
    return idx, embeds

def retrieve(query: str, index, texts, k=1):
    qv = model.encode([query], convert_to_numpy=True)
    D, I = index.search(qv.astype("float32"), k)
    return [(texts[i], float(D[0][j])) for j, i in enumerate(I[0])]
