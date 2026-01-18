from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from anthropic import Anthropic
from dotenv import load_dotenv
import os

# .env dosyasını yükle (encoding hatalarını handle et)
try:
    load_dotenv(encoding='utf-8')
except Exception as e:
    print(f"⚠️ Warning: Could not load .env file: {e}")
    print("You can set ANTHROPIC_API_KEY manually in environment variables")

# FastAPI uygulaması
app = FastAPI(title="AI Code Assistant API")

# CORS ayarları (React frontend'den istek almak için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Claude API client
anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
if not anthropic_api_key:
    print("⚠️ WARNING: ANTHROPIC_API_KEY not found in .env file")
    client = None
else:
    client = Anthropic(api_key=anthropic_api_key)

# Request modeli
class CodeAnalysisRequest(BaseModel):
    code: str
    language: str
    action: str  # "explain", "find_bugs", "improve"

# Health check endpoint
@app.get("/")
def root():
    return {
        "message": "AI Code Assistant API",
        "status": "running",
        "api_key_configured": anthropic_api_key is not None
    }

# Kod analizi endpoint
@app.post("/analyze")
async def analyze_code(request: CodeAnalysisRequest):
    if not client:
        raise HTTPException(
            status_code=500,
            detail="API key not configured. Please add ANTHROPIC_API_KEY to .env file"
        )
    
    if not request.code.strip():
        raise HTTPException(status_code=400, detail="Code cannot be empty")
    
    # Action'a göre prompt oluştur
    prompts = {
        "explain": f"""You are a helpful coding assistant. Analyze the following {request.language} code and explain what it does in a clear and concise way.

Code:
```{request.language}
{request.code}
```

Provide:
1. A brief overview of what the code does
2. Explanation of key components
3. Any notable patterns or techniques used

Keep the explanation clear and beginner-friendly.""",

        "find_bugs": f"""You are an expert code reviewer. Analyze the following {request.language} code and identify any bugs, errors, or potential issues.

Code:
```{request.language}
{request.code}
```

Provide:
1. List of bugs or errors found
2. Explanation of why each is a problem
3. Suggested fixes

If no bugs are found, mention that and provide any general code quality observations.""",

        "improve": f"""You are a senior software engineer. Review the following {request.language} code and suggest improvements.

Code:
```{request.language}
{request.code}
```

Provide:
1. Specific improvements for code quality
2. Performance optimizations if applicable
3. Best practices recommendations
4. Improved version of the code if needed

Focus on practical, actionable suggestions."""
    }
    
    prompt = prompts.get(request.action)
    if not prompt:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    try:
        # Claude API'ye istek gönder
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        # Response'u çıkar
        response_text = message.content[0].text
        
        return {
            "success": True,
            "response": response_text,
            "action": request.action,
            "language": request.language
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calling Claude API: {str(e)}"
        )

# Sunucu başlatıldığında
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting AI Code Assistant API...")
    print(f"📍 API will be available at: http://localhost:8000")
    print(f"📚 API docs at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)