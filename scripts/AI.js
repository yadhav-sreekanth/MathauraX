(() => {
  'use strict';

  /* ---------------------------
     1) Custom Replies
  --------------------------- */
  function specialReply(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const msg = raw.trim();
    const low = msg.toLowerCase();

    if (["hi", "hello", "hey"].includes(low)) return "👋 Hello! I'm your Math AI. Ask me any math question or type <code>help</code>.";
    if (low.includes("good morning")) return "🌅 Good morning! Ready for some math?";
    if (low.includes("good night")) return "🌙 Good night! Remember, math dreams are sweet!";
    if (low.includes("love")) return "Awwwww! Thank you love you too";
    if (low.includes("how are you")) return "🤖 I'm just code, but I'm ready to solve some math for you!";
    if (low.includes("thanks") || low.includes("thank you")) return "😊 You're welcome! Keep learning!";
    if (low === "about") return "I’m a client-side Math AI powered by SymPy (via Pyodide) and MathJax for rendering.";

    if (low === "help" || low === "/help") {
      return `
        <b>Commands</b><br>
        • <code>simplify 2x + 2x - 3x</code><br>
        • <code>factor x^4 - 1</code><br>
        • <code>expand (x+1)^5</code><br>
        • <code>derivative x^5, x, 2</code><br>
        • <code>integrate sin(x), x, 0, pi</code><br>
        • <code>limit sin(x)/x, x, 0</code><br>
        • <code>series exp(x), x, 0, 6</code><br>
        • <code>solve x^2 - 5x + 6 = 0</code><br>
        • <code>matrix [[1,2],[3,4]]</code>, <code>det [[1,2],[3,4]]</code>, <code>inv [[1,2],[3,4]]</code><br>
      `;
    }

    return null;
  }

  /* ---------------------------
     2) Pyodide + SymPy Setup
  --------------------------- */
  const pyodideReady = (async () => {
    if (typeof loadPyodide !== 'function') throw new Error('Pyodide is not loaded.');
    const pyodide = await loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/" });
    await pyodide.loadPackage('sympy');

    await pyodide.runPythonAsync(`
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, convert_xor
transforms = standard_transformations + (implicit_multiplication_application, convert_xor)

def _parse(s): return parse_expr(s, transformations=transforms)

def handle(query):
    q = query.strip()
    try:
        low = q.lower()
        if low.startswith("integrate "):
            args = [s.strip() for s in q[10:].split(",")]
            if len(args) == 1: res = integrate(_parse(args[0]), x)
            elif len(args) == 2: res = integrate(_parse(args[0]), symbols(args[1]))
            elif len(args) == 4: res = integrate(_parse(args[0]), (symbols(args[1]), sympify(args[2]), sympify(args[3])))
            else: return json.dumps({"ok": False, "error": "Usage: integrate f(x) [, x [, a, b]]"})
        elif low.startswith("derivative "):
            args = [s.strip() for s in q[10:].split(",")]
            f = _parse(args[0]); v = symbols(args[1]) if len(args) >= 2 else x; n = int(args[2]) if len(args) >= 3 else 1
            res = diff(f, v, n)
        elif low.startswith("solve "):
            payload = q[6:]
            if "," in payload: eqpart, varpart = payload.split(",", 1); var = symbols(varpart.strip())
            else: eqpart, var = payload, x
            equation = Eq(*[ _parse(s.strip()) for s in eqpart.split("=",1) ]) if "=" in eqpart else Eq(_parse(eqpart),0)
            res = solve(equation, var)
        elif low.startswith("limit "):
            f, v, A = [s.strip() for s in q[6:].split(",")]
            res = limit(_parse(f), symbols(v), sympify(A))
        elif low.startswith("series "):
            f, v, A, n = [s.strip() for s in q[7:].split(",")]
            res = series(_parse(f), symbols(v), sympify(A), int(n))
        elif low.startswith("matrix "): res = Matrix(sympify(q[7:].strip()))
        elif low.startswith("det "): res = Matrix(sympify(q[4:].strip())).det()
        elif low.startswith("inv "): res = Matrix(sympify(q[4:].strip())).inv()
        elif low.startswith("factor "): res = factor(_parse(q[7:].strip()))
        elif low.startswith("expand "): res = expand(_parse(q[7:].strip()))
        elif low.startswith("simplify "): res = simplify(_parse(q[9:].strip()))
        elif low.startswith("latex "): res = latex(_parse(q[6:].strip()))
        else: res = simplify(_parse(q))
        return json.dumps({"ok": True, "result": str(res), "latex": latex(res)})
    except Exception as e:
        return json.dumps({"ok": False, "error": str(e)})
`);
    return pyodide;
  })();

  /* ---------------------------
     3) Chat Helpers
  --------------------------- */
  function safeAppend(html, sender = 'ai') {
    const cw = document.getElementById('chatWindow');
    if (cw) {
      const div = document.createElement('div');
      div.className = `message ${sender}`;
      div.innerHTML = html;
      cw.appendChild(div);
      cw.scrollTop = cw.scrollHeight;
    }
  }

  function typesetChat(target) {
    if (window.MathJax?.typesetPromise) {
      const scope = target || document.getElementById('chatWindow');
      if (scope) MathJax.typesetPromise([scope]).catch(console.warn);
    }
  }

  function escapeHTML(str = '') {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* ---------------------------
     4) Response Generator
  --------------------------- */
  let selectedMode = 'general';

  async function generateResponse(raw) {
    const msg = (raw || '').trim();
    if (!msg) return;

    let processedMsg = msg;
    if (selectedMode === 'math' || selectedMode === 'equation') {
      processedMsg = msg
        .replace(/\bplus\b/gi, '+')
        .replace(/\bminus\b/gi, '-')
        .replace(/\btimes\b/gi, '*')
        .replace(/\bmultiplied by\b/gi, '*')
        .replace(/\bdivided by\b/gi, '/')
        .replace(/\bover\b/gi, '/');
    }

    if (selectedMode === 'general') {
      const special = specialReply(msg);
      if (special) { safeAppend(special, 'ai'); typesetChat(); return; }
    }

    const thinkingId = `thinking-${Date.now()}`;
    safeAppend(`<i id="${thinkingId}">🤔 Thinking…</i>`, 'ai');
    const bubble = document.getElementById(thinkingId);

    try {
      const pyodide = await pyodideReady;
      const pyResult = await pyodide.runPythonAsync(`handle(${JSON.stringify(processedMsg)})`);
      const data = JSON.parse(pyResult);

      if (data.ok) {
        const latex = data.latex || '';
        const resultStr = escapeHTML(data.result || '');
        const html = `<b>Result:</b> \\(${latex}\\)<br><small>${resultStr}</small>`;
        if (bubble) bubble.outerHTML = html;
        else safeAppend(html, 'ai');
        typesetChat();
      } else {
        const errHtml = `<b>Error:</b> ${escapeHTML(data.error || 'Unknown error')}`;
        if (bubble) bubble.outerHTML = errHtml;
        else safeAppend(errHtml, 'ai');
      }
    } catch (err) {
      const errMsg = `<b>Runtime error:</b> ${escapeHTML(err.message || String(err))}`;
      if (bubble) bubble.outerHTML = errMsg;
      else safeAppend(errMsg, 'ai');
    }
  }

  window.generateResponse = generateResponse;

  /* ---------------------------
     5) Button Handling & Highlight
  --------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('userInput');
    const buttons = {
      general: document.getElementById('btnGeneral'),
      math: document.getElementById('btnMath'),
      equation: document.getElementById('btnEquation')
    };

    Object.entries(buttons).forEach(([mode, btn]) => {
      btn.addEventListener('click', () => {
        selectedMode = mode;
        highlightModeButton(mode);
        if (input.value.trim()) generateResponse(input.value);
        input.value = '';
      });
    });

    input.addEventListener('keypress', e => {
      if (e.key === 'Enter' && input.value.trim()) {
        generateResponse(input.value);
        input.value = '';
      }
    });

    function highlightModeButton(mode) {
      Object.entries(buttons).forEach(([m, btn]) => {
        btn.classList.toggle('active', m === mode);
      });
    }

    highlightModeButton('general'); // default
    safeAppend("👋 Hello! I'm your Math AI. Type <code>help</code> to see what I can do.", "ai");
  });

})();
