import os
import base64
import google.generativeai as gen
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("⚠️ GEMINI_API_KEY missing in .env")

gen.configure(api_key=API_KEY)

app = FastAPI(title="AgriHills AI Crop Detection")

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/crop-check")
async def crop_check(
    image: UploadFile = File(...),
    cropType: str = Form("unknown")
):
    try:
        model = gen.GenerativeModel(
            "gemini-1.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )

        # Read image bytes
        img_bytes = await image.read()
        img_b64 = base64.b64encode(img_bytes).decode("utf-8")

        # 🔹 Stronger prompt for consistent advice
        prompt = f"""
You are a knowledgeable and cautious agronomy assistant. 
Analyze this leaf photo from a {cropType} crop. 
Identify possible diseases, pests, or nutrient deficiencies.

Return STRICT JSON in the following format only:
{{
  "is_healthy": <boolean>,
  "top_conditions": [{{"label": <string>, "confidence": <number 0-1>}}, ...],
  "advice": [
    "short, actionable step 1 (non-chemical first)",
    "step 2",
    "step 3"
  ]
}}

Rules:
- Always include at least 3 pieces of advice, even if unsure.
- Prefer safe, non-chemical actions first (remove infected leaves, improve airflow, sanitize tools, adjust watering).
- Mention general organic or biological control methods (like neem oil, compost tea).
- If needed, suggest consulting local agricultural experts for severe conditions.
- Keep it short and clear.
"""

        parts = [
            {"text": prompt},
            {"inline_data": {"mime_type": image.content_type or "image/jpeg", "data": img_b64}}
        ]

        # Send to Gemini
        response = model.generate_content([{"role": "user", "parts": parts}])
        import json

        # Try to parse Gemini response safely
        try:
            data = json.loads(response.text)
        except Exception:
            data = {"is_healthy": False, "top_conditions": [], "advice": []}

        # ✅ Fallback: ensure "advice" always exists
        if not isinstance(data.get("advice"), list) or len(data["advice"]) == 0:
            data["advice"] = [
                "Retake a clear photo: single leaf fills the frame in bright, even light.",
                "Remove the worst-affected leaves and sanitize your tools.",
                "Avoid overhead watering; water at soil level in the morning.",
                "Increase spacing and airflow between plants.",
                "Monitor neighboring plants for similar symptoms.",
            ]

        # ✅ Fallback: ensure top_conditions array exists
        if not isinstance(data.get("top_conditions"), list) or len(data["top_conditions"]) == 0:
            data["top_conditions"] = [
                {"label": "Unknown leaf issue", "confidence": 0.4}
            ]

        # ✅ If confidence is low, prepend advice
        try:
            top_conf = float(data["top_conditions"][0].get("confidence", 0))
        except Exception:
            top_conf = 0.0

        if top_conf < 0.6:
            data["advice"].insert(
                0,
                "Low confidence result — retake 2–3 photos from different leaves in good lighting."
            )

        return data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {e}")