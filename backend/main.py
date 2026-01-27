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
    allow_origins=["ai-code-assistant-vert.vercel.app"],
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
        "explain": f"""Sen yardımcı bir kodlama asistanısın.
Aşağıdaki {req.language} kodunu kısa ve öz bir şekilde Türkçe açıkla.

Kod:
```{req.language}
{req.code}
```

ÖNEMLİ:
- Maksimum 4-5 madde
- Kısa ve net cümleler
- Başlangıç seviyesine uygun

Format:
** Kod Açıklaması:**
• [Ana işlev]
• [Önemli detay 1]
• [Önemli detay 2]

Gereksiz uzatma, kısa ve anlaşılır ol.""",

        "find_bugs": f"""Sen uzman bir kod inceleyicisisin.
Aşağıdaki {req.language} kodundaki hataları bul, kısaca açıkla ve düzeltilmiş kodu ver.

Kod:
```{req.language}
{req.code}
```

ÖNEMLİ FORMAT:
1. Önce hataları listele (maksimum 3-4 madde)
2. Sonra düzeltilmiş kodu ver

Şu formatta yanıt ver:

** Bulunan Hatalar:**
• [Hata 1]: [Kısa açıklama]
• [Hata 2]: [Kısa açıklama]

** Düzeltilmiş Kod:**
```{req.language}
[düzeltilmiş kod]
```

Eğer hata yoksa sadece " Kod temiz, hata bulunamadı." yaz.""",

        "improve": f"""Sen kıdemli bir yazılım mühendisisin.
Aşağıdaki {req.language} kodunu iyileştir ve SADECE düzeltilmiş kodu döndür.

Orijinal Kod:
```{req.language}
{req.code}
```

ÖNEMLİ KURALLAR:
- Sadece iyileştirilmiş kodu yaz
- Hiçbir açıklama ekleme
- Başlık ekleme
- Markdown kod bloğu içinde yaz
- Tekrarlanan kod satırlarını kaldır
- Modern syntax kullan (const/let, arrow functions vb.)
- Gereksiz satırları temizle

Sadece şu formatta döndür:
```{req.language}
[temiz, iyileştirilmiş kod]
```"""
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
            print(f" Trying model: {model_name}")
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            
            if not response.text:
                raise ValueError("Empty response from Gemini")
            
            print(f" Success with model: {model_name}")
            return {
                "success": True,
                "response": response.text,
                "action": request.action,
                "language": request.language,
                "model_used": model_name
            }
        except Exception as e:
            last_error = str(e)
            print(f" Model {model_name} failed: {e}")
            continue
    
    # Hiçbir model çalışmadıysa
    raise HTTPException(
        status_code=500,
        detail=f"All models failed. Last error: {last_error}"
    )

if __name__ == "__main__":
    import uvicorn
    print(" Starting AI Code Assistant API")
    print(f" Using: google-genai SDK")
    print(f" Models: {', '.join(MODELS_TO_TRY)}")
    uvicorn.run(app, host="0.0.0.0", port=8000)