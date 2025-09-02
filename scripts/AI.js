/* Cleaned & consolidated script
   - Combines Quiz engine, Special Replies, Pyodide/SymPy bridge, chat wiring,
     UI helpers (intersection observer, mobile menu, card hover), and dark-mode toggle.
   - Safe guards for missing DOM elements (appendMessage, chatWindow, optional controls).
   - Assumes the page includes:
       * <script src="https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js"></script>
       * MathJax (optional for LaTeX typesetting)
   - Paste this as a single script file or inside a <script> tag.
*/

(() => {
  'use strict';

  /* ---------------------------
     1) Quiz Data & Engine
     --------------------------- */
  const quizData = [
    {
      q: "What is \\(2+3\\)?",
      options: ["3", "4", "5", "6"],
      correct: 2,
      explain: "Because 2 + 3 = 5."
    },
    {
      q: "Simplify: \\(2x + 2x - 3x\\)",
      options: ["\\(x\\)", "\\(2x\\)", "\\(3x\\)", "\\(0\\)"],
      correct: 0,
      explain: "2x + 2x - 3x = (4x - 3x) = x."
    },
    {
      q: "Derivative of \\(x^5\\) w.r.t. \\(x\\)?",
      options: ["\\(5x^4\\)", "\\(x^5\\)", "\\(x^4\\)", "\\(6x^5\\)"],
      correct: 0,
      explain: "d/dx x^5 = 5x^4."
    }
  ];

  const quizState = {
    active: false,
    index: 0,
    score: 0
  };

  function quizStart() {
    quizState.active = true;
    quizState.index = 0;
    quizState.score = 0;
    safeAppend("📘 Quiz started! Type <code>quiz next</code> to get the first question.", "ai");
  }

  function quizStop() {
    const msg = `🛑 Quiz ended. Final score: <b>${quizState.score}/${quizData.length}</b>`;
    quizState.active = false;
    safeAppend(msg, "ai");
  }

  function quizNext() {
    if (!quizState.active) {
      safeAppend("Start the quiz first: type <code>quiz start</code>.", "ai");
      return;
    }
    if (quizState.index >= quizData.length) {
      safeAppend(`🎉 Quiz complete! Final score: <b>${quizState.score}/${quizData.length}</b>`, "ai");
      quizState.active = false;
      return;
    }
    const item = quizData[quizState.index];
    const opts = item.options.map((opt, i) => `${i + 1}. ${opt}`).join("<br>");
    const html = `
      <div><b>Q${quizState.index + 1}:</b> ${item.q}</div>
      <div style="margin-top:6px">${opts}</div>
      <div style="margin-top:6px"><i>Answer with</i> <code>quiz answer N</code> (e.g., <code>quiz answer 2</code>).</div>
    `;
    safeAppend(html, "ai");
    typesetChat();
  }

  function quizAnswer(nStr) {
    if (!quizState.active) {
      safeAppend("Start the quiz first: type <code>quiz start</code>.", "ai");
      return;
    }
    const n = parseInt((nStr || '').trim(), 10);
    if (!(n >= 1 && n <= 4)) {
      safeAppend("Please answer with a number 1–4, e.g., <code>quiz answer 1</code>.", "ai");
      return;
    }
    const item = quizData[quizState.index];
    const isCorrect = (n - 1) === item.correct;
    if (isCorrect) quizState.score += 1;
    const feedback = isCorrect ? "✅ Correct!" : `❌ Incorrect. The correct answer is <b>${item.correct + 1}</b>.`;
    safeAppend(`${feedback}<br><small>${item.explain}</small>`, "ai");
    quizState.index += 1;
    if (quizState.index < quizData.length) {
      safeAppend(`Type <code>quiz next</code> for the next question.`, "ai");
    } else {
      safeAppend(`🎉 Quiz complete! Final score: <b>${quizState.score}/${quizData.length}</b>`, "ai");
      quizState.active = false;
    }
    typesetChat();
  }

  /* ---------------------------
     2) Special Reply Rules
     --------------------------- */
  function specialReply(raw) {
    if (!raw || typeof raw !== 'string') return null;
    const msg = raw.trim();
    const low = msg.toLowerCase();

    // Simple greetings
    if (["hi", "hello", "hey"].includes(low)) {
      return "👋 Hello! I'm your Math AI. Ask me any math question, or type <code>help</code>.";
    }

    // Help
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
        • <code>matrix [[1,2],[3,4]]</code>, <code>det [[1,2],[3,4]]</code>, <code>inv [[1,2],[3,4]]</code><br><br>
        <b>Quiz</b><br>
        • <code>quiz start</code> – begin quiz<br>
        • <code>quiz next</code> – next question<br>
        • <code>quiz answer N</code> – answer 1–4<br>
        • <code>quiz stop</code> – end quiz
      `;
    }

    // About
    if (low.includes("who are you") || low === "about") {
      return "🤖 I’m a client-side Math AI powered by SymPy (via Pyodide) and MathJax for rendering.";
    }

    // Quiz commands (handled here)
    if (low === "quiz start") { quizStart(); return "__handled__"; }
    if (low === "quiz stop")  { quizStop();  return "__handled__"; }
    if (low === "quiz next")  { quizNext();  return "__handled__"; }
    if (low.startsWith("quiz answer")) {
      const n = low.replace("quiz answer", "").trim();
      quizAnswer(n);
      return "__handled__";
    }

    // No special reply
    return null;
  }

  /* ---------------------------
     3) Pyodide + SymPy (lazy init)
     --------------------------- */
  const pyodideReady = (async () => {
    if (typeof loadPyodide !== 'function') {
      // If Pyodide isn't loaded, throw a clear error later when used
      throw new Error('Pyodide is not loaded. Make sure to include pyodide.js before this script.');
    }
    const pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/"
    });

    // load sympy
    await pyodide.loadPackage('sympy');

    // define helper Python handler
    await pyodide.runPythonAsync(`
import json
from sympy import *
from sympy.parsing.sympy_parser import parse_expr, standard_transformations, implicit_multiplication_application, convert_xor

transforms = standard_transformations + (implicit_multiplication_application, convert_xor)

def _parse(s):
    return parse_expr(s, transformations=transforms)

def handle(query):
    q = query.strip()
    try:
        low = q.lower()
        # integrate
        if low.startswith("integrate "):
            args = [s.strip() for s in q[10:].split(",")]
            if len(args) == 1:
                f = _parse(args[0]); res = integrate(f, x)
            elif len(args) == 2:
                f = _parse(args[0]); v = symbols(args[1]); res = integrate(f, v)
            elif len(args) == 4:
                f = _parse(args[0]); v = symbols(args[1]); A = sympify(args[2]); B = sympify(args[3])
                res = integrate(f, (v, A, B))
            else:
                return json.dumps({"ok": False, "error": "Usage: integrate f(x) [, x [, a, b]]"})
        elif low.startswith("derivative "):
            args = [s.strip() for s in q[10:].split(",")]
            f = _parse(args[0])
            v = symbols(args[1]) if len(args) >= 2 else x
            n = int(args[2]) if len(args) >= 3 else 1
            res = diff(f, v, n)
        elif low.startswith("solve "):
            payload = q[6:]
            if "," in payload:
                eqpart, varpart = payload.split(",", 1)
                var = symbols(varpart.strip())
            else:
                eqpart, var = payload, x
            if "=" in eqpart:
                L, R = [s.strip() for s in eqpart.split("=", 1)]
                equation = Eq(_parse(L), _parse(R))
            else:
                equation = Eq(_parse(eqpart), 0)
            res = solve(equation, var)
        elif low.startswith("limit "):
            f, v, A = [s.strip() for s in q[6:].split(",")]
            res = limit(_parse(f), symbols(v), sympify(A))
        elif low.startswith("series "):
            f, v, A, n = [s.strip() for s in q[7:].split(",")]
            res = series(_parse(f), symbols(v), sympify(A), int(n))
        elif low.startswith("matrix "):
            M = Matrix(sympify(q[7:].strip())); res = M
        elif low.startswith("det "):
            M = Matrix(sympify(q[4:].strip())); res = M.det()
        elif low.startswith("inv "):
            M = Matrix(sympify(q[4:].strip())); res = M.inv()
        elif low.startswith("eigen "):
            M = Matrix(sympify(q[6:].strip())); res = M.eigenvals()
        elif low.startswith("factor "):
            res = factor(_parse(q[7:].strip()))
        elif low.startswith("expand "):
            res = expand(_parse(q[7:].strip()))
        elif low.startswith("simplify "):
            res = simplify(_parse(q[9:].strip()))
        elif low.startswith("latex "):
            res = latex(_parse(q[6:].strip()))
        else:
            res = simplify(_parse(q))
        return json.dumps({"ok": True, "result": str(res), "latex": latex(res)})
    except Exception as e:
        return json.dumps({"ok": False, "error": str(e)})
`);

    return pyodide;
  })();

  /* ---------------------------
     4) Chat wiring & response
     --------------------------- */

  // Helper: safe appendMessage wrapper (if appendMessage not present, fallback to console)
  function safeAppend(html, sender = 'ai') {
    try {
      if (typeof appendMessage === 'function') {
        appendMessage(html, sender);
      } else {
        // fallback: simple DOM append to an element with id 'chatWindow' if present
        const cw = document.getElementById('chatWindow') || document.querySelector('.chatWindow');
        if (cw) {
          const div = document.createElement('div');
          div.className = `message ${sender}`;
          div.innerHTML = html;
          cw.appendChild(div);
          // scroll to bottom
          cw.scrollTop = cw.scrollHeight;
        } else {
          // last fallback
          console.log(`[${sender}] ${html.replace(/<[^>]+>/g, '')}`);
        }
      }
    } catch (e) {
      console.error('safeAppend error', e);
    }
  }

  // Helper: typeset MathJax for chat area
  function typesetChat(target) {
    try {
      if (window.MathJax?.typesetPromise) {
        const scope = target || document.getElementById('chatWindow') || document.querySelector('.chatWindow');
        if (scope) MathJax.typesetPromise([scope]).catch((e) => console.warn('MathJax error', e));
      }
    } catch (e) {
      // ignore
    }
  }

  // HTML-escape helper
  function escapeHTML(str = '') {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Main generateResponse function (call this with user's input)
  async function generateResponse(raw) {
    const msg = (raw || '').trim();
    if (!msg) return;

    // 1) Special replies (quiz/help/greetings)
    const special = specialReply(msg);
    if (special === "__handled__") return; // already handled by specialReply (quiz functions posted messages)
    if (typeof special === "string" && special) {
      safeAppend(special, "ai");
      typesetChat();
      return;
    }

    // 2) Otherwise, treat as math query -> send to Pyodide/SymPy
    safeAppend("Thinking…", "ai");
    // Grab the last message bubble if it exists (for replacing "Thinking…" with results)
    const cw = document.getElementById('chatWindow') || document.querySelector('.chatWindow');
    const lastBubble = cw ? cw.lastElementChild : null;

    try {
      const pyodide = await pyodideReady;
      // run handler
      const pyResult = await pyodide.runPythonAsync(`handle(${JSON.stringify(msg)})`);
      const data = JSON.parse(pyResult);

      if (data.ok) {
        const latex = data.latex || '';
        const resultStr = escapeHTML(data.result || '');
        const html = `<b>Result:</b> \\(${latex}\\)<br><small>${resultStr}</small>`;
        if (lastBubble) lastBubble.innerHTML = html;
        else safeAppend(html, 'ai');
        typesetChat(lastBubble || undefined);
      } else {
        const errHtml = `<b>Error:</b> ${escapeHTML(data.error || 'Unknown error')}`;
        if (lastBubble) lastBubble.innerHTML = errHtml;
        else safeAppend(errHtml, 'ai');
      }
    } catch (err) {
      const errMsg = `<b>Runtime error:</b> ${escapeHTML(err.message || String(err))}`;
      if (lastBubble) lastBubble.innerHTML = errMsg;
      else safeAppend(errMsg, 'ai');
      console.error('generateResponse error', err);
    }
  }

  // Expose generateResponse globally (if not present) for UI to call
  if (!window.generateResponse) window.generateResponse = generateResponse;

  /* ---------------------------
     5) UI Utilities (observers, menu, hover, dark-mode)
     --------------------------- */

  // Intersection observer for sections (single instance)
  function initSectionObserver() {
    try {
      const sections = document.querySelectorAll('section');
      if (!sections || !sections.length) return;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
      sections.forEach(s => obs.observe(s));
    } catch (e) {
      console.warn('initSectionObserver error', e);
    }
  }

  // Mobile menu & settings dropdown safe init
  function initMenuControls() {
    try {
      const navToggle = document.getElementById('navToggle');
      const navMenu = document.querySelector('.nav-menu');
      const settingsIcon = document.getElementById('settingsIcon');
      const settingsDropdown = document.getElementById('settingsDropdown');
      const body = document.body;

      if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          navMenu.classList.toggle('open');
          body.classList.toggle('menu-open');
        });

        document.addEventListener('click', (e) => {
          if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('open');
            body.classList.remove('menu-open');
          }
        });

        let resizeTimer = null;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            if (window.innerWidth > 880) {
              navMenu.classList.remove('open');
              body.classList.remove('menu-open');
            }
          }, 250);
        });
      }

      if (settingsIcon && settingsDropdown) {
        settingsIcon.addEventListener('click', (e) => {
          e.preventDefault(); e.stopPropagation();
          settingsDropdown.classList.toggle('show');
        });
        document.addEventListener('click', (e) => {
          if (!settingsIcon.contains(e.target) && !settingsDropdown.contains(e.target)) {
            settingsDropdown.classList.remove('show');
          }
        });
      }
    } catch (e) {
      console.warn('initMenuControls error', e);
    }
  }

  // Add hover animations for topic cards
  function initCardHover() {
    try {
      const cards = document.querySelectorAll('.topic-card');
      if (!cards || !cards.length) return;
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-10px) scale(1.02) rotateX(5deg)';
          card.style.transition = 'transform 220ms ease';
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0) scale(1) rotateX(0)';
        });
      });
    } catch (e) {
      // no-op
    }
  }

  // Dark-mode toggle: safe wiring (guard element presence)
  function initDarkModeToggle() {
    try {
      const toggleBtn = document.getElementById('darkModeToggle');
      if (!toggleBtn) {
        // If there's no toggle, but we still want to respect stored pref:
        const currentMode = localStorage.getItem('darkMode');
        if (currentMode === 'enabled') document.body.classList.add('dark-mode');
        return;
      }
      const currentMode = localStorage.getItem('darkMode');
      if (currentMode === 'enabled') {
        document.body.classList.add('dark-mode');
        toggleBtn.textContent = '☀️ Light Mode';
      } else {
        toggleBtn.textContent = '🌙 Dark Mode';
      }
      toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
          localStorage.setItem('darkMode', 'enabled');
          toggleBtn.textContent = '☀️ Light Mode';
        } else {
          localStorage.setItem('darkMode', 'disabled');
          toggleBtn.textContent = '🌙 Dark Mode';
        }
      });
    } catch (e) {
      console.warn('initDarkModeToggle error', e);
    }
  }

  /* ---------------------------
     6) Boot / DOM init
     --------------------------- */
  function boot() {
    // Init UI helpers
    initSectionObserver();
    initMenuControls();
    initCardHover();
    initDarkModeToggle();

    // Optional initial greeting if appendMessage exists
    try {
      if (typeof appendMessage === 'function') {
        appendMessage("👋 Hello! I'm your Math AI. Type <code>help</code> to see what I can do, or try <code>simplify 2x + 2x - 3x</code>.<br>Start a quiz with <code>quiz start</code>.", "ai");
      } else {
        // also try to append to chatWindow element
        const cw = document.getElementById('chatWindow') || document.querySelector('.chatWindow');
        if (cw) {
          const div = document.createElement('div');
          div.className = 'message ai';
          div.innerHTML = "👋 Hello! I'm your Math AI. Type <code>help</code> to see what I can do, or try <code>simplify 2x + 2x - 3x</code>.<br>Start a quiz with <code>quiz start</code>.";
          cw.appendChild(div);
          cw.scrollTop = cw.scrollHeight;
        }
      }
    } catch (e) {
      console.warn('boot greeting error', e);
    }
  }

  // Boot on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  /* ---------------------------
     7) Expose small helpers
     --------------------------- */
  // Expose quiz control & special command runner for UI use (optional)
  window.mathAI = window.mathAI || {};
  window.mathAI.quizStart = quizStart;
  window.mathAI.quizStop  = quizStop;
  window.mathAI.quizNext  = quizNext;
  window.mathAI.quizAnswer = quizAnswer;
  window.mathAI.generateResponse = generateResponse;
  window.mathAI.specialReply = specialReply;

  // If you want to test from console:
  // window.mathAI.generateResponse("simplify 2x+2x-3x");
})();
