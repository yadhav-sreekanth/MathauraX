async function generateResponse(msg) {
  msg = msg.toLowerCase().trim();

  // GREETINGS & GENERAL RESPONSES
  const casualReplies = {
    "hello|hi|hey": "Hi there! How can I help with math today? 👋",
    "good morning": "Good morning! Let's solve some math 🌞",
    "good afternoon": "Good afternoon! I'm always ready to help with math! 😊",
    "good evening": "Good evening! Let's crunch some numbers 🌙",
    "good night": "Good night! Sleep well and dream of equations 😴",
    "how are you|how's it going": "I'm an AI—I don't have feelings, but I'm always ready to help with math! 😊",
    "who are you|your name": "You can call me MathauraX AI 😊 I'm your friendly math assistant!",
    "creator|made you": `My creator is <b>Yadhav Sreekanth</b> — a passionate developer and math wizard. 🔥<br><br>
    Projects? 👉 <a href='https://yadhav-sreekanth.github.io/Yadhav-Portfolio' target='_blank' style="text-decoration: none; color: #66ccff;">Portfolio 🌐</a>`,
    "help|explain": "Sure! Tell me which math topic or problem you need help with. 🧮",
    "solve|answer": "Alright! Paste your math problem and I'll solve it step-by-step. 🧠",
    "formula": "Need a formula? Let me know the topic and I'll share it! 📐",
    "example": "Sure! Tell me the topic, and I'll give you some examples. ✍️",
    "thank you|thanks": "You're welcome! 😊 Got more questions?",
    "you are great|you are smart|you are the best": "Aww, thank you! You're amazing too 🤗",
    "i love you": "That's sweet! I love helping you with math 🧡",
    "you are cute|you look good": "Thank you 😊 I'm just a bunch of smart code!",
    "joke|funny": "Why did the math book look sad? Because it had too many problems 😢➡️😆",
    "bored|entertain me": "Let's break the boredom! Want a riddle, joke, or a fun fact? 🤩",
    "are you real|are you human": "Not human, but I'm smarter than your average calculator 🤖",
    "do you sleep|do you eat": "Nope, no sleep or snacks for me. Just 24/7 math power! ⚡",
    "malayalam": "സാധിക്കും! ഞാൻ മലയാളത്തിൽ സഹായിക്കാൻ തയ്യാറാണ് 😊",
    "can you code": "Yep! I'm built with code, and I love solving logic problems 💻",
    "i have exam|exam tomorrow|test": "Don't worry, you've got this! Want help revising something? 💪",
    "homework|assignment": "Sure! Let's get that homework done together. Just show me the question 📚",
    "school is boring|math is boring": "Let me make it fun! Want to try a cool puzzle or shortcut trick? 😄",
    "what is life": "42. According to math... and Hitchhiker's Guide to the Galaxy 😅",
    "sing a song": "🎵 Twinkle twinkle little star, let's solve math and be a star! ⭐",
    "i hate math": "Ouch! 😢 But maybe I can change your mind with some math magic?",
    "are you my friend": "Of course! I'm your math buddy always here to help 🫂",
    "say something": "Did you know? Zero is the only number that can't be represented in Roman numerals! 🤯",
    "tired|i can't do this": "You're doing great! Take a deep breath and let's tackle it step-by-step 💪",
    "confused|don't get it": "No worries! Just tell me which part is tricky. We'll work through it together 😊",
    "play a game|quiz me": "Ready for a math quiz? 🤓 Try this: What's 15% of 240?",
    "motivate me|inspire me": "\"Mathematics is the music of reason.\" – James Joseph Sylvester 🎵📐"
  };

  for (let pattern in casualReplies) {
    if (new RegExp(pattern).test(msg)) {
      return appendMessage(casualReplies[pattern], "ai");
    }
  }

  // NUMBER WORD TO DIGIT CONVERSION
  const numberWords = {
    'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15, 'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19, 'twenty': 20,
    'thirty': 30, 'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90, 'hundred': 100, 'thousand': 1000, 'million': 1000000
  };

  // Convert spelled numbers to digits
  let processedMsg = msg;
  for (let word in numberWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    processedMsg = processedMsg.replace(regex, numberWords[word]);
  }

  // COMPREHENSIVE MATH PATTERN RECOGNITION
  const mathPatterns = [
    // Square root patterns
    {
      pattern: /(?:square root|sqrt|root)\s*(?:of\s*)?(\d+(?:\.\d+)?)/gi,
      type: 'sqrt',
      examples: ['square root of 4', 'sqrt 16', 'root 25', 'square root of two', 'root of four']
    },
    // Cube root patterns
    {
      pattern: /(?:cube root|cbrt)\s*(?:of\s*)?(\d+(?:\.\d+)?)/gi,
      type: 'cbrt',
      examples: ['cube root of 8', 'cbrt 27', 'cube root of three']
    },
    // Power patterns
    {
      pattern: /(\d+(?:\.\d+)?)\s*(?:raised to|to the power of|power|^)\s*(\d+(?:\.\d+)?)/gi,
      type: 'power',
      examples: ['2 raised to 3', '5 to the power of 2', '3 power 4']
    },
    // Square patterns
    {
      pattern: /(?:square of|(\d+(?:\.\d+)?)\s*squared)/gi,
      type: 'square',
      examples: ['square of 5', '3 squared', 'square of two']
    },
    // Cube patterns
    {
      pattern: /(?:cube of|(\d+(?:\.\d+)?)\s*cubed)/gi,
      type: 'cube',
      examples: ['cube of 4', '2 cubed', 'cube of three']
    },
    // Basic operations
    {
      pattern: /(\d+(?:\.\d+)?)\s*(?:plus|added to|sum of)\s*(\d+(?:\.\d+)?)/gi,
      type: 'add',
      examples: ['5 plus 3', '2 added to 7', 'sum of 4 and 6']
    },
    {
      pattern: /(\d+(?:\.\d+)?)\s*(?:minus|subtracted from|take away)\s*(\d+(?:\.\d+)?)/gi,
      type: 'subtract',
      examples: ['10 minus 3', '5 subtracted from 12', 'take away 2 from 8']
    },
    {
      pattern: /(\d+(?:\.\d+)?)\s*(?:times|multiplied by|multiply)\s*(\d+(?:\.\d+)?)/gi,
      type: 'multiply',
      examples: ['4 times 5', '3 multiplied by 7', 'multiply 2 by 6']
    },
    {
      pattern: /(\d+(?:\.\d+)?)\s*(?:divided by|divide)\s*(\d+(?:\.\d+)?)/gi,
      type: 'divide',
      examples: ['15 divided by 3', 'divide 20 by 4', '10 divided by 2']
    },
    // Percentage patterns
    {
      pattern: /(\d+(?:\.\d+)?)\s*(?:percent|%)\s*(?:of|from)\s*(\d+(?:\.\d+)?)/gi,
      type: 'percentage',
      examples: ['25 percent of 80', '15% of 200', '10 percent of 50']
    },
    // Factorial patterns
    {
      pattern: /(?:factorial of|(\d+)\s*factorial)/gi,
      type: 'factorial',
      examples: ['factorial of 5', '6 factorial', 'factorial of three']
    },
    // Prime number patterns
    {
      pattern: /(?:is\s*)?(\d+)\s*(?:prime|a prime number)/gi,
      type: 'isPrime',
      examples: ['is 17 prime', '23 a prime number', 'is 15 prime']
    },
    // GCD/LCM patterns
    {
      pattern: /(?:gcd|greatest common divisor)\s*(?:of\s*)?(\d+)\s*(?:and\s*)?(\d+)/gi,
      type: 'gcd',
      examples: ['gcd of 12 and 18', 'greatest common divisor of 24 and 36']
    },
    {
      pattern: /(?:lcm|least common multiple)\s*(?:of\s*)?(\d+)\s*(?:and\s*)?(\d+)/gi,
      type: 'lcm',
      examples: ['lcm of 6 and 8', 'least common multiple of 12 and 15']
    },
    // Statistics patterns
    {
      pattern: /(?:mean|average)\s*(?:of\s*)?([\d\s,]+)/gi,
      type: 'mean',
      examples: ['mean of 2, 4, 6, 8', 'average of 10 15 20']
    },
    {
      pattern: /(?:median)\s*(?:of\s*)?([\d\s,]+)/gi,
      type: 'median',
      examples: ['median of 1, 3, 5, 7, 9', 'median of 2 4 6 8']
    },
    {
      pattern: /(?:mode)\s*(?:of\s*)?([\d\s,]+)/gi,
      type: 'mode',
      examples: ['mode of 1, 2, 2, 3, 4', 'mode of 5 5 6 7 8']
    }
  ];

  // MATH FUNCTIONS WITH PROPER ERROR HANDLING
  const mathFunctions = {
    sqrt: (x) => {
      if (x < 0) {
        return {
          result: "Undefined",
          explanation: `<b>Square Root Error:</b><br>
          • Input: √${x}<br>
          • Error: Square root of negative number is not a real number<br>
          • Result: Undefined in real numbers<br>
          <i>Note: √${x} = ${Math.sqrt(Math.abs(x))}i (imaginary number)</i>`
        };
      }
      const result = Math.sqrt(x);
      return {
        result: result,
        explanation: `<b>Square Root Calculation:</b><br>
        • Input: √${x}<br>
        • Process: Finding a number that when multiplied by itself equals ${x}<br>
        • Result: ${result}<br>
        • Verification: ${result} × ${result} = ${result * result}<br>
        <i>Note: Square root is the inverse operation of squaring a number.</i>`
      };
    },
    cbrt: (x) => {
      const result = Math.cbrt(x);
      return {
        result: result,
        explanation: `<b>Cube Root Calculation:</b><br>
        • Input: ∛${x}<br>
        • Process: Finding a number that when multiplied by itself three times equals ${x}<br>
        • Result: ${result}<br>
        • Verification: ${result} × ${result} × ${result} = ${result * result * result}<br>
        <i>Note: Cube root is the inverse operation of cubing a number.</i>`
      };
    },
    power: (base, exp) => {
      const result = Math.pow(base, exp);
      return {
        result: result,
        explanation: `<b>Power Calculation:</b><br>
        • Input: ${base}^${exp}<br>
        • Process: ${base} multiplied by itself ${exp} times<br>
        • Calculation: ${base}${' × ' + base}.repeat(exp - 1)} = ${result}<br>
        • Result: ${result}<br>
        <i>Note: Exponentiation is repeated multiplication.</i>`
      };
    },
    square: (x) => {
      const result = Math.pow(x, 2);
      return {
        result: result,
        explanation: `<b>Square Calculation:</b><br>
        • Input: ${x}²<br>
        • Process: ${x} × ${x}<br>
        • Result: ${result}<br>
        • Verification: √${result} = ${Math.sqrt(result)}<br>
        <i>Note: Squaring a number means multiplying it by itself.</i>`
      };
    },
    cube: (x) => {
      const result = Math.pow(x, 3);
      return {
        result: result,
        explanation: `<b>Cube Calculation:</b><br>
        • Input: ${x}³<br>
        • Process: ${x} × ${x} × ${x}<br>
        • Result: ${result}<br>
        • Verification: ∛${result} = ${Math.cbrt(result)}<br>
        <i>Note: Cubing a number means multiplying it by itself three times.</i>`
      };
    },
    add: (a, b) => {
      const result = a + b;
      return {
        result: result,
        explanation: `<b>Addition:</b><br>
        • Input: ${a} + ${b}<br>
        • Process: Combining two numbers<br>
        • Result: ${result}<br>
        • Verification: ${result} - ${b} = ${a}<br>
        <i>Note: Addition is commutative: ${a} + ${b} = ${b} + ${a}</i>`
      };
    },
    subtract: (a, b) => {
      const result = a - b;
      return {
        result: result,
        explanation: `<b>Subtraction:</b><br>
        • Input: ${a} - ${b}<br>
        • Process: Finding the difference between two numbers<br>
        • Result: ${result}<br>
        • Verification: ${result} + ${b} = ${a}<br>
        <i>Note: Subtraction is not commutative: ${a} - ${b} ≠ ${b} - ${a}</i>`
      };
    },
    multiply: (a, b) => {
      const result = a * b;
      return {
        result: result,
        explanation: `<b>Multiplication:</b><br>
        • Input: ${a} × ${b}<br>
        • Process: Repeated addition of ${a}, ${b} times<br>
        • Result: ${result}<br>
        • Verification: ${result} ÷ ${b} = ${a}<br>
        <i>Note: Multiplication is commutative: ${a} × ${b} = ${b} × ${a}</i>`
      };
    },
    divide: (a, b) => {
      if (b === 0) {
        return {
          result: "Undefined",
          explanation: `<b>Division Error:</b><br>
          • Input: ${a} ÷ ${b}<br>
          • Error: Division by zero is undefined<br>
          • Reason: No number multiplied by 0 equals ${a}<br>
          <i>Note: Division by zero is not allowed in mathematics.</i>`
        };
      }
      const result = a / b;
      return {
        result: result,
        explanation: `<b>Division:</b><br>
        • Input: ${a} ÷ ${b}<br>
        • Process: Finding how many times ${b} fits into ${a}<br>
        • Result: ${result}<br>
        • Verification: ${result} × ${b} = ${a}<br>
        <i>Note: Division is not commutative: ${a} ÷ ${b} ≠ ${b} ÷ ${a}</i>`
      };
    },
    percentage: (percent, total) => {
      const result = (percent / 100) * total;
      return {
        result: result,
        explanation: `<b>Percentage Calculation:</b><br>
        • Input: ${percent}% of ${total}<br>
        • Process: (${percent} ÷ 100) × ${total}<br>
        • Calculation: ${percent/100} × ${total} = ${result}<br>
        • Result: ${result}<br>
        • Verification: ${result} is ${((result/total)*100).toFixed(2)}% of ${total}<br>
        <i>Note: Percentage means "per hundred" - ${percent}% = ${percent}/100</i>`
      };
    },
    factorial: (n) => {
      if (n < 0) {
        return {
          result: "Undefined",
          explanation: `<b>Factorial Error:</b><br>
          • Input: ${n}!<br>
          • Error: Factorial is not defined for negative numbers<br>
          <i>Note: Factorial is only defined for non-negative integers.</i>`
        };
      }
      if (n === 0 || n === 1) {
        return {
          result: 1,
          explanation: `<b>Factorial:</b><br>
          • Input: ${n}!<br>
          • Definition: ${n}! = 1 (by definition)<br>
          • Result: 1<br>
          <i>Note: 0! and 1! are both defined as 1.</i>`
        };
      }
      let result = 1;
      let steps = [];
      for (let i = 2; i <= n; i++) {
        result *= i;
        steps.push(`${i}`);
      }
      return {
        result: result,
        explanation: `<b>Factorial:</b><br>
        • Input: ${n}!<br>
        • Process: ${n}! = ${steps.join(' × ')}<br>
        • Calculation: ${result}<br>
        • Result: ${result}<br>
        <i>Note: Factorial represents the number of ways to arrange ${n} distinct objects.</i>`
      };
    },
    isPrime: (n) => {
      if (n <= 1) {
        return {
          result: false,
          explanation: `<b>Prime Number Check:</b><br>
          • Input: ${n}<br>
          • Result: Not prime<br>
          • Reason: Numbers less than or equal to 1 are not prime<br>
          <i>Note: Prime numbers are greater than 1 and have exactly two factors.</i>`
        };
      }
      if (n === 2) {
        return {
          result: true,
          explanation: `<b>Prime Number Check:</b><br>
          • Input: ${n}<br>
          • Result: Prime<br>
          • Reason: 2 is the only even prime number<br>
          <i>Note: 2 is the smallest and only even prime number.</i>`
        };
      }
      if (n % 2 === 0) {
        return {
          result: false,
          explanation: `<b>Prime Number Check:</b><br>
          • Input: ${n}<br>
          • Result: Not prime<br>
          • Reason: ${n} is even and greater than 2<br>
          <i>Note: All even numbers greater than 2 are composite.</i>`
        };
      }
      for (let i = 3; i <= Math.sqrt(n); i += 2) {
        if (n % i === 0) {
          return {
            result: false,
            explanation: `<b>Prime Number Check:</b><br>
            • Input: ${n}<br>
            • Result: Not prime<br>
            • Reason: ${n} is divisible by ${i}<br>
            • Factors found: 1, ${i}, ..., ${n}<br>
            <i>Note: A prime number has exactly two factors: 1 and itself.</i>`
          };
        }
      }
      return {
        result: true,
        explanation: `<b>Prime Number Check:</b><br>
        • Input: ${n}<br>
        • Result: Prime<br>
        • Reason: No factors found other than 1 and ${n}<br>
        • Factors: 1, ${n}<br>
        <i>Note: ${n} is a prime number with exactly two factors.</i>`
      };
    },
    gcd: (a, b) => {
      let x = Math.abs(a);
      let y = Math.abs(b);
      let steps = [];
      while (y !== 0) {
        steps.push(`${x} = ${y} × ${Math.floor(x/y)} + ${x % y}`);
        [x, y] = [y, x % y];
      }
      return {
        result: x,
        explanation: `<b>Greatest Common Divisor (GCD):</b><br>
        • Input: GCD(${a}, ${b})<br>
        • Process: Using Euclidean algorithm<br>
        • Steps: ${steps.join('<br>• ')}<br>
        • Result: ${x}<br>
        <i>Note: GCD is the largest number that divides both ${a} and ${b} without remainder.</i>`
      };
    },
    lcm: (a, b) => {
      const gcdResult = mathFunctions.gcd(a, b);
      const gcd = gcdResult.result;
      const result = Math.abs(a * b) / gcd;
      return {
        result: result,
        explanation: `<b>Least Common Multiple (LCM):</b><br>
        • Input: LCM(${a}, ${b})<br>
        • Process: LCM = |${a} × ${b}| ÷ GCD(${a}, ${b})<br>
        • GCD(${a}, ${b}) = ${gcd}<br>
        • Calculation: |${a} × ${b}| ÷ ${gcd} = ${Math.abs(a * b)} ÷ ${gcd} = ${result}<br>
        • Result: ${result}<br>
        <i>Note: LCM is the smallest number that is a multiple of both ${a} and ${b}.</i>`
      };
    },
    mean: (numbers) => {
      if (numbers.length === 0) {
        return {
          result: "Undefined",
          explanation: `<b>Mean Error:</b><br>
          • Input: Empty array<br>
          • Error: Cannot calculate mean of empty data set<br>
          <i>Note: Mean requires at least one data point.</i>`
        };
      }
      const sum = numbers.reduce((a, b) => a + b, 0);
      const result = sum / numbers.length;
      return {
        result: result,
        explanation: `<b>Mean (Average):</b><br>
        • Input: [${numbers.join(', ')}]<br>
        • Process: Sum ÷ Count<br>
        • Sum: ${numbers.join(' + ')} = ${sum}<br>
        • Count: ${numbers.length}<br>
        • Calculation: ${sum} ÷ ${numbers.length} = ${result}<br>
        • Result: ${result}<br>
        <i>Note: Mean represents the central tendency of the data set.</i>`
      };
    },
    median: (numbers) => {
      if (numbers.length === 0) {
        return {
          result: "Undefined",
          explanation: `<b>Median Error:</b><br>
          • Input: Empty array<br>
          • Error: Cannot calculate median of empty data set<br>
          <i>Note: Median requires at least one data point.</i>`
        };
      }
      const sorted = numbers.slice().sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const result = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      return {
        result: result,
        explanation: `<b>Median:</b><br>
        • Input: [${numbers.join(', ')}]<br>
        • Process: Middle value of sorted data<br>
        • Sorted: [${sorted.join(', ')}]<br>
        • Middle position: ${mid + 1}<br>
        • Result: ${result}<br>
        <i>Note: Median is the middle value that separates the higher half from the lower half.</i>`
      };
    },
    mode: (numbers) => {
      if (numbers.length === 0) {
        return {
          result: "Undefined",
          explanation: `<b>Mode Error:</b><br>
          • Input: Empty array<br>
          • Error: Cannot calculate mode of empty data set<br>
          <i>Note: Mode requires at least one data point.</i>`
        };
      }
      const freq = {};
      numbers.forEach(n => freq[n] = (freq[n] || 0) + 1);
      const maxFreq = Math.max(...Object.values(freq));
      const modes = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
      return {
        result: modes,
        explanation: `<b>Mode:</b><br>
        • Input: [${numbers.join(', ')}]<br>
        • Process: Most frequent value(s)<br>
        • Frequency: ${Object.entries(freq).map(([k, v]) => `${k}: ${v}`).join(', ')}<br>
        • Maximum frequency: ${maxFreq}<br>
        • Result: [${modes.join(', ')}]<br>
        <i>Note: Mode is the value(s) that appear most frequently in the data set.</i>`
      };
    }
  };

  // PROCESS MATH PATTERNS WITH PROPER ERROR HANDLING
  for (let pattern of mathPatterns) {
    const matches = [...processedMsg.matchAll(pattern.pattern)];
    if (matches.length > 0) {
      const match = matches[0];
      const func = mathFunctions[pattern.type];
      
      if (func) {
        try {
          let params;
          if (pattern.type === 'mean' || pattern.type === 'median' || pattern.type === 'mode') {
            // Extract numbers from comma/space separated list
            const numStr = match[1].replace(/\s+/g, '');
            params = numStr.split(',').map(n => parseFloat(n));
            if (params.some(isNaN)) {
              return appendMessage(`<b>Error:</b> Invalid numbers in the input. Please provide valid numbers separated by commas.`, "ai");
            }
          } else if (pattern.type === 'power') {
            params = [parseFloat(match[1]), parseFloat(match[2])];
          } else if (pattern.type === 'square' || pattern.type === 'cube') {
            params = [parseFloat(match[1] || match[0])];
      } else {
            params = [parseFloat(match[1]), parseFloat(match[2])];
          }
          
          if (params.some(isNaN)) {
            return appendMessage(`<b>Error:</b> Invalid numbers in the input. Please provide valid numbers.`, "ai");
          }
          
          const result = func(...params);
          return appendMessage(result.explanation, "ai");
        } catch (error) {
          console.error('Math function error:', error);
          return appendMessage(`<b>Error:</b> Unable to calculate ${pattern.type}. Please check your input and try again.`, "ai");
        }
      }
    }
  }

  // ADVANCED MATHEMATICAL OPERATIONS
  const advancedPatterns = [
    // Calculus patterns
    {
      pattern: /(?:derivative|differentiate)\s+(?:of\s+)?([^,\n]+)/gi,
      type: 'derivative',
      examples: ['derivative of x^2', 'differentiate sin(x)', 'derivative of 2x + 3']
    },
    {
      pattern: /(?:integral|integrate)\s+(?:of\s+)?([^,\n]+)/gi,
      type: 'integral',
      examples: ['integral of x', 'integrate x^2', 'integral of sin(x)']
    },
    {
      pattern: /(?:limit|lim)\s+(?:of\s+)?([^,\n]+)\s+(?:as\s+)?([^,\n]+)\s+(?:approaches|goes to)\s+([^,\n]+)/gi,
      type: 'limit',
      examples: ['limit of x^2 as x approaches 2', 'lim x->0 sin(x)/x']
    },
    // Matrix patterns
    {
      pattern: /(?:determinant|det)\s+(?:of\s+)?\[([^\]]+)\]/gi,
      type: 'determinant',
      examples: ['determinant of [[1,2],[3,4]]', 'det [[a,b],[c,d]]']
    },
    // Statistics patterns
    {
      pattern: /(?:variance|var)\s+(?:of\s+)?([\d\s,]+)/gi,
      type: 'variance',
      examples: ['variance of 1, 2, 3, 4, 5', 'var 10, 20, 30']
    },
    {
      pattern: /(?:standard deviation|std)\s+(?:of\s+)?([\d\s,]+)/gi,
      type: 'std',
      examples: ['standard deviation of 1, 2, 3, 4, 5', 'std 10, 20, 30']
    }
  ];

  // Check for advanced patterns
  for (let pattern of advancedPatterns) {
    const matches = [...processedMsg.matchAll(pattern.pattern)];
    if (matches.length > 0) {
      const match = matches[0];
      
      if (typeof mathEngine !== 'undefined' && mathEngine.advancedMath) {
        try {
          let result;
          switch (pattern.type) {
            case 'derivative':
              result = mathEngine.advancedMath.derivative(match[1]);
              break;
            case 'integral':
              result = mathEngine.advancedMath.integral(match[1]);
              break;
            case 'limit':
              result = mathEngine.advancedMath.limit(match[1], match[2], match[3]);
              break;
            case 'determinant':
              const matrix = parseMatrix(match[1]);
              if (matrix) {
                result = mathEngine.advancedMath.matrixOperations.determinant(matrix);
              } else {
                return appendMessage(`<b>Error:</b> Invalid matrix format. Please use format like [[1,2],[3,4]]`, "ai");
              }
              break;
            case 'variance':
              const numbers = match[1].split(/[,\s]+/).map(n => parseFloat(n));
              if (numbers.some(isNaN)) {
                return appendMessage(`<b>Error:</b> Invalid numbers in the input. Please provide valid numbers separated by commas.`, "ai");
              }
              result = mathEngine.advancedMath.statistics.descriptiveStats(numbers).variance;
              break;
            case 'std':
              const stdNumbers = match[1].split(/[,\s]+/).map(n => parseFloat(n));
              if (stdNumbers.some(isNaN)) {
                return appendMessage(`<b>Error:</b> Invalid numbers in the input. Please provide valid numbers separated by commas.`, "ai");
              }
              result = mathEngine.advancedMath.statistics.descriptiveStats(stdNumbers).standardDeviation;
              break;
          }
          
          if (result) {
            return appendMessage(`<b>Advanced ${pattern.type.charAt(0).toUpperCase() + pattern.type.slice(1)} Calculation:</b><br>
            • Input: ${match[0]}<br>
            • Result: ${result}<br>
            <i>Note: This calculation uses advanced mathematical algorithms.</i>`, "ai");
          }
        } catch (error) {
          console.error('Advanced math error:', error);
          return appendMessage(`<b>Error:</b> Unable to calculate ${pattern.type}. Please check your input and try again.`, "ai");
        }
      }
    }
  }

  // API Integration for complex queries
  if (typeof mathAPIs !== 'undefined') {
    // Check if query might benefit from external APIs
    const apiKeywords = ['solve', 'equation', 'system', 'graph', 'plot', 'sequence', 'series', 'theorem'];
    const hasApiKeyword = apiKeywords.some(keyword => processedMsg.toLowerCase().includes(keyword));
    
    if (hasApiKeyword) {
      try {
        const apiResults = await mathAPIs.searchMathematicalDatabase(processedMsg, 'all');
        
        if (apiResults.wolfram && apiResults.wolfram !== 'No results found') {
          return appendMessage(`<b>Advanced Mathematical Analysis:</b><br>
          • Query: ${msg}<br>
          • Result: ${apiResults.wolfram}<br>
          <i>Powered by advanced mathematical databases.</i>`, "ai");
        }
      } catch (error) {
        console.error('API integration error:', error);
      }
    }
  }

  // FALLBACK FOR COMPLEX EXPRESSIONS
  try {
    // Try to evaluate as a mathematical expression
    let expression = processedMsg
      .replace(/plus/g, '+')
      .replace(/minus/g, '-')
      .replace(/times/g, '*')
      .replace(/multiplied by/g, '*')
      .replace(/divided by/g, '/')
      .replace(/square root of (\d+)/gi, 'Math.sqrt($1)')
      .replace(/cube root of (\d+)/gi, 'Math.cbrt($1)')
      .replace(/(\d+) squared/gi, 'Math.pow($1, 2)')
      .replace(/(\d+) cubed/gi, 'Math.pow($1, 3)')
      .replace(/(\d+) to the power (\d+)/gi, 'Math.pow($1, $2)');

    const result = Function('"use strict"; return (' + expression + ')')();
    return appendMessage(`<b>Expression Evaluation:</b><br>
    • Input: ${msg}<br>
    • Processed: ${expression}<br>
    • Result: ${result}<br>
    <i>Note: This is the direct evaluation of your mathematical expression.</i>`, "ai");
  } catch (err) {
    // If all else fails, provide comprehensive help
    return appendMessage(`I understand you're asking about math, but I need a bit more clarity. 🤔<br><br>
    <b>Try asking in one of these ways:</b><br>
    • Basic: "square root of 16", "5 plus 3", "factorial of 5"<br>
    • Advanced: "derivative of x^2", "integral of x", "determinant of [[1,2],[3,4]]"<br>
    • Statistics: "mean of 2, 4, 6, 8", "variance of 1, 2, 3, 4, 5"<br>
    • Complex: "solve x^2 + 5x + 6 = 0", "graph y = x^2"<br><br>
    <i>You can also use spelled numbers like "square root of two" or "three plus five"!</i><br><br>
    <b>Available Advanced Features:</b><br>
    • Calculus: Derivatives, integrals, limits<br>
    • Linear Algebra: Matrix operations, determinants, eigenvalues<br>
    • Statistics: Descriptive statistics, probability distributions<br>
    • Number Theory: Prime factorization, modular arithmetic<br>
    • Geometry: Area, volume, distance calculations<br>
    • Trigonometry: Triangle solving, trigonometric functions<br>
    • Optimization: Gradient descent, Newton's method<br>
    • Graph Theory: Shortest path, minimum spanning tree`, "ai");
  }
}

// Helper function to parse matrix from string
function parseMatrix(matrixStr) {
  try {
    // Remove extra spaces and brackets
    const clean = matrixStr.replace(/\s+/g, '').replace(/[\[\]]/g, '');
    const rows = clean.split(';').map(row => 
      row.split(',').map(num => parseFloat(num))
    );
    
    // Validate matrix
    if (rows.length === 0 || rows[0].length === 0) return null;
    const rowLength = rows[0].length;
    for (let row of rows) {
      if (row.length !== rowLength) return null;
      if (row.some(isNaN)) return null;
    }
    
    return rows;
  } catch (error) {
    return null;
  }
}






