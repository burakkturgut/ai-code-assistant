from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from typing import Literal
import os

load_dotenv(encoding="utf-8")

app = FastAPI(title="AI Code Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in .env file")

client = genai.Client(api_key=GEMINI_API_KEY)

# Resmi dokümantasyondan güncel model adları
MODELS_TO_TRY = [
    "gemini-2.5-flash",      # En yeni model
    "gemini-1.5-flash",      # Yedek model
    "gemini-1.5-pro"         # Alternatif
]

class CodeAnalysisRequest(BaseModel):
    code: str
    language: str
    action: Literal["explain", "find_bugs", "improve"]

@app.get("/")
def root():
    return {
        "status": "running",
        "sdk": "google-genai",
        "available_models": MODELS_TO_TRY
    }

def build_prompt(req: CodeAnalysisRequest) -> str:
    prompts = {
        "explain": f"""You are a helpful coding assistant.
Explain the following {req.language} code clearly and concisely.

Code:
```{req.language}
{req.code}
```

Provide:
1. Brief overview
2. Key components explanation
3. Notable patterns

Use bullet points and be beginner-friendly.""",

        "find_bugs": f"""You are an expert code reviewer.
Find bugs or issues in the following {req.language} code.

Code:
```{req.language}
{req.code}
```

Provide:
1. List of bugs/errors found
2. Why each is a problem
3. Suggested fixes

Use bullet points.""",

        "improve": f"""You are a senior software engineer.
Improve the following {req.language} code.

Code:
```{req.language}
{req.code}
```

Provide:
1. Code quality improvements
2. Performance optimizations
3. Best practices
4. Improved code example if needed

Use bullet points and be practical."""
    }
    return prompts[req.action]

@app.post("/analyze")
async def analyze_code(request: CodeAnalysisRequest):
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    
    prompt = build_prompt(request)
    
    # Farklı modelleri sırayla dene
    last_error = None
    for model_name in MODELS_TO_TRY:
        try:
            print(f"🔄 Trying model: {model_name}")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            
            if not response.text:
                raise ValueError("Empty response from Gemini")
            
            print(f"✅ Success with model: {model_name}")
            return {
                "success": True,
                "response": response.text,
                "action": request.action,
                "language": request.language,
                "model_used": model_name
            }
        except Exception as e:
            last_error = str(e)
            print(f"❌ Model {model_name} failed: {e}")
            continue
    
    # Hiçbir model çalışmadıysa
    raise HTTPException(
        status_code=500,
        detail=f"All models failed. Last error: {last_error}"
    )

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting AI Code Assistant API")
    print(f"📦 Using: google-genai SDK")
    print(f"🤖 Models: {', '.join(MODELS_TO_TRY)}")
    uvicorn.run(app, host="0.0.0.0", port=8000)