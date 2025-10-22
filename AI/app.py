from flask import Flask, request, jsonify, send_from_directory
import requests
from werkzeug.utils import safe_join, secure_filename
from sympy import sympify, solve, simplify
import math, cmath, numpy as np, scipy, statistics
from PIL import Image
import pytesseract
import pdfplumber
import os
from werkzeug.utils import secure_filename
from supabase import create_client, Client
import sympy as sp
import json
import asyncio  # <-- Import asyncio

# -----------------------------
# Flask app
app = Flask(__name__, static_folder="public")

# Serve frontend
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "ai.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)

# -----------------------------
# Supabase config
SUPABASE_URL = "https://prjbggmmprpdpxrwdppl.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByamJnZ21tcHJwZHB4cndkcHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMzg3MDEsImV4cCI6MjA3NDgxNDcwMX0.QLwamx6xv6RmGJRkZ7wcXD_oNMZrb_hCXgOtgwBAov0"
supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# -----------------------------
# Upload folder
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "pdf"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# -----------------------------
# Topics folder (with subfolders)
TOPICS_FOLDER = r"E:\MathauraX\topics"
os.makedirs(TOPICS_FOLDER, exist_ok=True)

# -----------------------------
# Database helpers
def save_message(user_id: str, sender: str, message: str):
    try:
        supabase_client.table("chat_messages").insert({
            "user_id": user_id,
            "sender": sender,
            "message": message
        }).execute()
    except Exception as e:
        print("Supabase insert error:", e)

def get_history(user_id: str):
    try:
        res = supabase_client.table("chat_messages")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("id", ascending=True)\
            .execute()
        return res.data if res.data else []
    except Exception as e:
        print("Supabase fetch error:", e)
        return []

# -----------------------------
# Helper: find topic HTML file in folder/subfolders
def find_topic_file(user_message: str) -> str:
    """
    Recursively search topics folder for a file matching a keyword in user_message.
    Returns relative path to the file if found.
    """
    keyword = user_message.lower()
    for root, dirs, files in os.walk(TOPICS_FOLDER):
        for file in files:
            if file.endswith(".html"):
                topic_name = file.rsplit('.', 1)[0].lower()
                if topic_name in keyword:
                    # Return relative path from TOPICS_FOLDER
                    return os.path.relpath(os.path.join(root, file), TOPICS_FOLDER)
    return None

# -----------------------------
# Math processing functions
def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_text_math(text: str) -> str:
    text = text.strip()
    if not text:
        return "<span style='color:red'>Empty input!</span>"

    # SymPy solve
    try:
        expr = sympify(text)
        sol = solve(expr)
        if sol:
            return f"<span style='color:green'><b>SymPy solution:</b> {sol}</span>"
    except:
        pass

    # Simplify
    try:
        expr = sympify(text)
        simple = simplify(expr)
        return f"<span style='color:blue'><b>Simplified:</b> {simple}</span>"
    except:
        pass

    # Numerical eval
    try:
        local_vars = {"math": math, "cmath": cmath, "np": np, "numpy": np, "scipy": scipy, "statistics": statistics}
        result = eval(text, {"__builtins__": {}}, local_vars)
        return f"<span style='color:purple'><b>Numerical:</b> {result}</span>"
    except:
        pass

    return "<span style='color:red'>Sorry, I could not solve this problem.</span>"

# -----------------------------
# File processing
def process_image(file_path: str) -> str:
    try:
        img = Image.open(file_path)
        text = pytesseract.image_to_string(img)
        return process_text_math(text)
    except Exception as e:
        return f"<span style='color:red'>Cannot read image: {str(e)}</span>"

def process_pdf(file_path: str) -> str:
    try:
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                t = page.extract_text()
                if t:
                    text += t + "\n"
        return process_text_math(text)
    except Exception as e:
        return f"<span style='color:red'>Cannot read PDF: {str(e)}</span>"

# -----------------------------
# Route to serve HTML topics safely via iframe
@app.route("/topic/<path:filepath>")
def serve_topic(filepath):
    safe_path = safe_join(TOPICS_FOLDER, filepath)
    if os.path.exists(safe_path):
        return send_from_directory(TOPICS_FOLDER, filepath)
    return "<h3>Topic not found!</h3>", 404

# -----------------------------
# Flask Routes
@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    user_id = data.get("user_id", "anonymous")
    message = data.get("message", "").strip()
    if not message:
        return jsonify({"reply": "<span style='color:red'>Empty message!</span>"})

    # Check for topic match
    topic_file = find_topic_file(message)
    if topic_file:
        # Return iframe HTML
        iframe_html = f'''
<iframe src="/topic/{topic_file}" 
        width="100%" 
        height="600px"  # adjust as needed
        style="border:1px solid #ccc; max-width:100%;"
        allowfullscreen>
</iframe>
'''
        reply = iframe_html
    else:
        # fallback to math
        reply = process_text_math(message)

    save_message(user_id, "ai", reply)
    save_message(user_id, "user", message)
    return jsonify({"reply": reply})

@app.route("/upload", methods=["POST"])
def upload_file():
    user_id = request.form.get("user_id", "anonymous")
    file = request.files.get("file")

    if not file or not allowed_file(file.filename):
        return jsonify({"reply": "<span style='color:red'>No valid file uploaded!</span>"})

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    if filename.lower().endswith((".png", ".jpg", ".jpeg")):
        reply = process_image(file_path)
    elif filename.lower().endswith(".pdf"):
        reply = process_pdf(file_path)
    else:
        reply = "<span style='color:red'>Unsupported file type!</span>"

    save_message(user_id, "ai", reply)
    return jsonify({"reply": reply})

@app.route("/history/<user_id>")
def history(user_id):
    return jsonify(get_history(user_id))

@app.route('/eval', methods=['POST'])
def eval_expr():
    data = request.get_json() or {}
    expr = data.get('expr', '')
    try:
        x = sp.Symbol('x')
        # parse_expr is safer than eval; allow common functions
        sym = sp.sympify(expr, evaluate=True)
        simplified = sp.simplify(sym)
        numeric = None
        try:
            numeric = float(sp.N(simplified))
        except Exception:
            numeric = None
        return jsonify({
            'expr': str(expr),
            'sympy': str(simplified),
            'numeric': numeric
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# -----------------------------
# Async function for math evaluation
async def ask(expr):
    loop = asyncio.get_event_loop()
    r = await loop.run_in_executor(None, lambda: requests.post('http://localhost:3000/math/eval', json={"expr": expr}))
    return r.json()

# usage
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True, port=8000)
