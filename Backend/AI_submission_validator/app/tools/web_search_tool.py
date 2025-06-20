# app/tools/web_search_tool.py
from langchain.tools import TavilySearchResults

def get_web_search_tool():
    return TavilySearchResults(k=3)
