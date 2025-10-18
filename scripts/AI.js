  (() => {
    'use strict';

    let chatHistory = [];

    /* ---------------------------
      1) Special Replies
    --------------------------- */
    function specialReply(raw) {
      if (!raw) return null;
      const msg = raw.trim().toLowerCase();
      if(["hi","hello","hey"].includes(msg)) return "👋 Hello! I'm your Math AI. Ask any math question or type <code>help</code>.";
      if(msg.includes("how are you")) return "🤖 I'm just code, but ready to solve math for you!";
      if(msg.includes("thanks") || msg.includes("thank you")) return "😊 You're welcome!";
      if(msg==="help") return "Type a math query or topic and I'll try to help!";
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

  def _parse(s): 
      try:
          return parse_expr(s, transformations=transforms)
      except Exception:
          return None  # Return None if parsing fails

  def handle(query):
      q = query.strip()
      try:
          expr = _parse(q)
          if expr is None:
              return json.dumps({"ok": False, "error": "Not a valid math expression or unknown topic."})

          low = q.lower()
          if low.startswith("integrate "):
              args = [s.strip() for s in q[10:].split(",")]
              if len(args)==1: res = integrate(_parse(args[0]), x)
              elif len(args)==2: res = integrate(_parse(args[0]), symbols(args[1]))
              elif len(args)==4: res = integrate(_parse(args[0]), (symbols(args[1]), sympify(args[2]), sympify(args[3])))
              else: return json.dumps({"ok": False, "error":"Usage: integrate f(x) [, x [, a, b]]"})
          elif low.startswith("derivative "):
              args = [s.strip() for s in q[10:].split(",")]
              f=_parse(args[0]); v=symbols(args[1]) if len(args)>=2 else x; n=int(args[2]) if len(args)>=3 else 1
              res=diff(f,v,n)
          elif low.startswith("solve "):
              payload=q[6:]
              var=x
              if "," in payload:
                  eqpart,varpart=payload.split(",",1)
                  var=symbols(varpart.strip())
              else: eqpart=payload
              eq=Eq(*[_parse(s.strip()) for s in eqpart.split("=",1)]) if "=" in eqpart else Eq(_parse(eqpart),0)
              res=solve(eq,var)
          elif low.startswith("limit "):
              f,v,A=[s.strip() for s in q[6:].split(",")]
              res=limit(_parse(f),symbols(v),sympify(A))
          elif low.startswith("series "):
              f,v,A,n=[s.strip() for s in q[7:].split(",")]
              res=series(_parse(f),symbols(v),sympify(A),int(n))
          elif low.startswith("factor "): res=factor(_parse(q[7:].strip()))
          elif low.startswith("expand "): res=expand(_parse(q[7:].strip()))
          elif low.startswith("simplify "): res=simplify(_parse(q[9:].strip()))
          else: res=simplify(expr)
          return json.dumps({"ok": True, "result": str(res), "latex": latex(res)})
      except Exception as e:
          return json.dumps({"ok": False, "error": str(e)})
  `);

      return pyodide;
    })();

    /* ---------------------------
      3) Utilities
    --------------------------- */
    function escapeHTML(str=''){ return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

    function safeAppend(content, sender='ai'){
    const cw = document.getElementById('chatWindow');
    if(!cw) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    Object.assign(messageDiv.style, {
        display: 'flex',
        justifyContent: sender==='ai' ? 'flex-start' : 'flex-end',
        margin: '10px',
        width: '100%',
    });

    const bubble = document.createElement('div');

    // Render HTML for AI, escape HTML for user
    bubble.innerHTML = sender==='ai' ? content : escapeHTML(content);

    Object.assign(bubble.style, {
        maxWidth: '70%',
        padding: '12px 16px',
        borderRadius: '12px',
        backgroundColor: sender==='ai' ? '#f5f5f5' : '#6a5acd',
        color: sender==='ai' ? '#000' : '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        wordWrap: 'break-word',
        textAlign: 'left',
        lineHeight: '1.5',
        fontFamily: 'Arial, sans-serif',
        fontSize: '15px',
        whiteSpace: 'pre-wrap'
    });

    // Special style for code blocks inside AI message
    bubble.querySelectorAll('code').forEach(el => {
        Object.assign(el.style, {
            backgroundColor: '#eee',
            padding: '2px 4px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '14px',
        });
    });

    messageDiv.appendChild(bubble);
    cw.appendChild(messageDiv);
    cw.scrollTop = cw.scrollHeight;

    return bubble;
}



    async function typeWriter(content, container){
      return new Promise(resolve=>{
        if(!container){resolve(); return;}
        container.innerHTML='';
        const chars=content.split(''), cw=document.getElementById('chatWindow');
        let i=0;
        function typeChar(){
          if(i<chars.length){
            container.innerHTML+=chars[i++];
            if(cw) cw.scrollTop=cw.scrollHeight;
            setTimeout(typeChar,15);
          } else resolve();
        }
        typeChar();
      });
    }

  async function fetchTopic(topic){
      try{
          const res = await fetch(`topics/${topic}.html`);
          if(!res.ok) return null;
          let html = await res.text();

          // Remove scripts, styles, head/body/html tags
          html = html.replace(/<script[\s\S]*?<\/script>/gi,'')
                    .replace(/<style[\s\S]*?<\/style>/gi,'')
                    .replace(/<html.*?>|<\/html>/gi,'')
                    .replace(/<head.*?>[\s\S]*?<\/head>/gi,'')
                    .replace(/<body.*?>|<\/body>/gi,'');

          // Convert HTML to plain text
          const tmp = document.createElement("div");
          tmp.innerHTML = html;
          const text = tmp.textContent || tmp.innerText || "";

          return text;
      } catch(e) {
          return null;
      }
  }


    /* ---------------------------
      4) Generate AI Response
    --------------------------- */
    async function generateResponse(raw){
      const msg = (raw||'').trim();
      if(!msg) return;
      const inputEl = document.getElementById('userInput');
      if(inputEl) inputEl.disabled = true;

      // Display user question
      safeAppend(`<b>You:</b> ${escapeHTML(msg)}`, 'user');

      // 1️⃣ Check for special replies
      const special = specialReply(msg);
      if(special){
          await typeWriter(special, safeAppend('', 'ai'));
          if(inputEl) inputEl.disabled = false;
          return;
      }

      // Thinking placeholder
      const thinking = safeAppend('🤔 Thinking...', 'ai');

      try{
          // 2️⃣ Try topic folder first
          const topicFile = await fetchTopic(msg.replace(/\s+/g,'_').toLowerCase());
          if(topicFile){
              await typeWriter(topicFile, thinking);
              if(inputEl) inputEl.disabled = false;
              return;
          }

          // 3️⃣ Pyodide/SymPy fallback
          const py = await pyodideReady;
          const result = await py.runPythonAsync(`handle(${JSON.stringify(msg)})`);
          const data = JSON.parse(result);

          if(data.ok){
              await typeWriter(`<b>Result:</b> \\(${data.latex}\\)<br><small>${escapeHTML(data.result)}</small>`, thinking);
          } else {
              await typeWriter(`<b>Error:</b> ${escapeHTML(data.error || 'Unknown')}`, thinking);
          }

      } catch(e){
          await typeWriter(`<b>Runtime error:</b> ${escapeHTML(e.message||String(e))}`, thinking);
      }

      if(inputEl) inputEl.disabled = false;
    }

    /* ---------------------------
      5) Create Fullscreen AI Panel Dynamically
    --------------------------- */
function createAIContainer() {
  if (document.getElementById('aiAssistant')) return;

  const container = document.createElement('div');
  container.id = 'aiAssistant';
  Object.assign(container.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'white',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    opacity: 0,
    visibility: 'hidden',
    transition: 'all 0.4s ease-in-out'
  });

  // Header
  const header = document.createElement('div');
  Object.assign(header.style, {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: '#6a5acd',
    color: 'white',
    flexShrink: 0
  });

  const titleDiv = document.createElement('div');
  titleDiv.style.display = 'flex';
  titleDiv.style.alignItems = 'center';
  const logo = document.createElement('img');
  logo.src = 'assets/logo.svg';
  logo.style.width = '40px';
  logo.style.marginRight = '10px';
  titleDiv.appendChild(logo);
  const titleText = document.createElement('div');
  titleText.innerText = 'MathauraX AI Assistant';
  titleDiv.appendChild(titleText);
  header.appendChild(titleDiv);

  const headerBtns = document.createElement('div');
  const clearBtn = document.createElement('button');
  clearBtn.innerText = '🗑️';
  Object.assign(clearBtn.style, {marginRight: '10px', cursor: 'pointer', fontSize: '1.2rem', background: 'transparent', border: 'none', color: 'white'});
  const closeBtn = document.createElement('button');
  closeBtn.innerText = '✖';
  Object.assign(closeBtn.style, {cursor: 'pointer', fontSize: '1.2rem', background: 'transparent', border: 'none', color: 'white'});
  headerBtns.appendChild(clearBtn);
  headerBtns.appendChild(closeBtn);
  header.appendChild(headerBtns);

  container.appendChild(header);

  // Chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'chatWindow';
  Object.assign(chatWindow.style, {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    background: '#e5e5e5'
  });
  container.appendChild(chatWindow);

  // Input container (sticky bottom)
  const inputContainer = document.createElement('div');
  Object.assign(inputContainer.style, {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
    flexShrink: 0,
    background: '#fff'
  });

  const input = document.createElement('input');
  input.id = 'userInput';
  input.type = 'text';
  input.placeholder = 'Type your math question...';
  Object.assign(input.style, {flex: 1, padding: '8px', borderRadius: '5px', border: '1px solid #ccc'});

  const sendBtn = document.createElement('button');
  sendBtn.innerText = '➤';
  Object.assign(sendBtn.style, {marginLeft: '8px', padding: '8px 12px', border: 'none', background: '#6a5acd', color: '#fff', borderRadius: '5px', cursor: 'pointer'});

  inputContainer.appendChild(input);
  inputContainer.appendChild(sendBtn);
  container.appendChild(inputContainer);

  document.body.appendChild(container);

  // Event listeners
  document.getElementById('openAI')?.addEventListener('click', () => {
    container.style.display = 'flex';
    setTimeout(() => { container.style.opacity = 1; container.style.visibility = 'visible'; }, 10);
  });
  closeBtn.addEventListener('click', () => {
    container.style.opacity = 0;
    setTimeout(() => { container.style.display = 'none'; container.style.visibility = 'hidden'; }, 400);
  });
  clearBtn.addEventListener('click', () => { chatWindow.innerHTML = ''; chatHistory = []; });
  input.addEventListener('keypress', e => { if(e.key === 'Enter' && input.value.trim()) { generateResponse(input.value); input.value = ''; } });
  sendBtn.addEventListener('click', () => { if(input.value.trim()) { generateResponse(input.value); input.value = ''; } });


      safeAppend("👋 Hello! I'm your Math AI. Type <code>help</code> to see what I can do.",'ai');
    }

    document.addEventListener('DOMContentLoaded', createAIContainer);

  })();
