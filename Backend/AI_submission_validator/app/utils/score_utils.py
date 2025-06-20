def interpret_score(score: float) -> str:
    if score > 0.9:
        return "identical or very similar"
    if score > 0.7:
        return "paraphrased content"
    return "unique/low similarity"
