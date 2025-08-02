// MathauraX Advanced Math Engine
// Integrates multiple JavaScript libraries for comprehensive mathematical operations

class MathauraXEngine {
    constructor() {
        this.loadLibraries();
        this.initializeMathFunctions();
    }

    // Load external mathematical libraries
    loadLibraries() {
        // Math.js - Advanced mathematics library
        if (typeof math === 'undefined') {
            this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.11.0/math.min.js');
        }
        
        // Chart.js - For plotting and visualization
        if (typeof Chart === 'undefined') {
            this.loadScript('https://cdn.jsdelivr.net/npm/chart.js');
        }
        
        // MathJax - For beautiful mathematical notation
        if (typeof MathJax === 'undefined') {
            this.loadScript('https://polyfill.io/v3/polyfill.min.js?features=es6');
            this.loadScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js');
        }
        
        // Plotly.js - For advanced plotting
        if (typeof Plotly === 'undefined') {
            this.loadScript('https://cdn.plot.ly/plotly-latest.min.js');
        }
        
        // Algebra.js - For symbolic algebra
        if (typeof algebra === 'undefined') {
            this.loadScript('https://cdn.jsdelivr.net/npm/algebra.js@0.2.6/lib/algebra.min.js');
        }
    }

    loadScript(src) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
    }

    initializeMathFunctions() {
        // Advanced mathematical functions
        this.advancedMath = {
            // Calculus Operations
            derivative: (expression, variable = 'x') => {
                try {
                    if (typeof math !== 'undefined') {
                        return math.derivative(expression, variable).toString();
                    }
                    return this.symbolicDerivative(expression, variable);
                } catch (error) {
                    return `Error calculating derivative: ${error.message}`;
                }
            },

            integral: (expression, variable = 'x') => {
                try {
                    if (typeof math !== 'undefined') {
                        return math.integrate(expression, variable).toString();
                    }
                    return this.symbolicIntegral(expression, variable);
                } catch (error) {
                    return `Error calculating integral: ${error.message}`;
                }
            },

            limit: (expression, variable, value) => {
                try {
                    if (typeof math !== 'undefined') {
                        return math.evaluate(`limit(${expression}, ${variable}, ${value})`);
                    }
                    return this.numericalLimit(expression, variable, value);
                } catch (error) {
                    return `Error calculating limit: ${error.message}`;
                }
            },

            // Linear Algebra
            matrixOperations: {
                determinant: (matrix) => {
                    try {
                        if (typeof math !== 'undefined') {
                            return math.det(matrix);
                        }
                        return this.calculateDeterminant(matrix);
                    } catch (error) {
                        return `Error calculating determinant: ${error.message}`;
                    }
                },

                inverse: (matrix) => {
                    try {
                        if (typeof math !== 'undefined') {
                            return math.inv(matrix);
                        }
                        return this.calculateInverse(matrix);
                    } catch (error) {
                        return `Error calculating inverse: ${error.message}`;
                    }
                },

                eigenvalues: (matrix) => {
                    try {
                        if (typeof math !== 'undefined') {
                            return math.eigs(matrix);
                        }
                        return this.calculateEigenvalues(matrix);
                    } catch (error) {
                        return `Error calculating eigenvalues: ${error.message}`;
                    }
                },

                solveSystem: (coefficients, constants) => {
                    try {
                        if (typeof math !== 'undefined') {
                            return math.lusolve(coefficients, constants);
                        }
                        return this.solveLinearSystem(coefficients, constants);
                    } catch (error) {
                        return `Error solving system: ${error.message}`;
                    }
                }
            },

            // Statistics and Probability
            statistics: {
                descriptiveStats: (data) => {
                    const stats = {
                        mean: this.calculateMean(data),
                        median: this.calculateMedian(data),
                        mode: this.calculateMode(data),
                        variance: this.calculateVariance(data),
                        standardDeviation: this.calculateStandardDeviation(data),
                        range: this.calculateRange(data),
                        quartiles: this.calculateQuartiles(data)
                    };
                    return stats;
                },

                probability: {
                    binomial: (n, p, k) => this.binomialProbability(n, p, k),
                    normal: (x, mean, std) => this.normalProbability(x, mean, std),
                    poisson: (lambda, k) => this.poissonProbability(lambda, k)
                },

                hypothesisTesting: {
                    tTest: (sample1, sample2) => this.performTTest(sample1, sample2),
                    chiSquare: (observed, expected) => this.performChiSquareTest(observed, expected),
                    correlation: (x, y) => this.calculateCorrelation(x, y)
                }
            },

            // Number Theory
            numberTheory: {
                primeFactorization: (n) => this.primeFactorization(n),
                gcd: (a, b) => this.calculateGCD(a, b),
                lcm: (a, b) => this.calculateLCM(a, b),
                totient: (n) => this.eulerTotient(n),
                modularInverse: (a, m) => this.modularInverse(a, m),
                chineseRemainder: (remainders, moduli) => this.chineseRemainderTheorem(remainders, moduli)
            },

            // Geometry
            geometry: {
                area: {
                    circle: (radius) => Math.PI * radius * radius,
                    triangle: (base, height) => 0.5 * base * height,
                    rectangle: (length, width) => length * width,
                    polygon: (sides, apothem) => 0.5 * sides * apothem * 2 * Math.sin(Math.PI / sides)
                },
                volume: {
                    sphere: (radius) => (4/3) * Math.PI * Math.pow(radius, 3),
                    cylinder: (radius, height) => Math.PI * radius * radius * height,
                    cone: (radius, height) => (1/3) * Math.PI * radius * radius * height
                },
                distance: {
                    euclidean: (p1, p2) => Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2)),
                    manhattan: (p1, p2) => Math.abs(p2[0] - p1[0]) + Math.abs(p2[1] - p1[1])
                }
            },

            // Trigonometry
            trigonometry: {
                solveTriangle: (sides, angles) => this.solveTriangle(sides, angles),
                lawOfCosines: (a, b, c) => this.lawOfCosines(a, b, c),
                lawOfSines: (a, b, A, B) => this.lawOfSines(a, b, A, B)
            },

            // Optimization
            optimization: {
                gradientDescent: (func, start, learningRate = 0.01, iterations = 1000) => 
                    this.gradientDescent(func, start, learningRate, iterations),
                newtonMethod: (func, derivative, start, tolerance = 1e-6) => 
                    this.newtonMethod(func, derivative, start, tolerance)
            },

            // Graph Theory
            graphTheory: {
                shortestPath: (graph, start, end) => this.dijkstra(graph, start, end),
                minimumSpanningTree: (graph) => this.kruskal(graph),
                topologicalSort: (graph) => this.topologicalSort(graph)
            }
        };
    }

    // Custom implementations for when external libraries aren't available
    symbolicDerivative(expression, variable) {
        // Basic symbolic differentiation rules
        const rules = {
            'x^n': 'n*x^(n-1)',
            'sin(x)': 'cos(x)',
            'cos(x)': '-sin(x)',
            'e^x': 'e^x',
            'ln(x)': '1/x'
        };
        
        // This is a simplified version - in practice, you'd want a more robust parser
        for (let pattern in rules) {
            if (expression.includes(pattern)) {
                return expression.replace(pattern, rules[pattern]);
            }
        }
        return 'Symbolic differentiation not available';
    }

    calculateDeterminant(matrix) {
        if (matrix.length === 1) return matrix[0][0];
        if (matrix.length === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }
        
        let det = 0;
        for (let i = 0; i < matrix[0].length; i++) {
            const minor = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
            det += matrix[0][i] * Math.pow(-1, i) * this.calculateDeterminant(minor);
        }
        return det;
    }

    calculateMean(data) {
        return data.reduce((sum, val) => sum + val, 0) / data.length;
    }

    calculateMedian(data) {
        const sorted = data.slice().sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    calculateMode(data) {
        const freq = {};
        data.forEach(val => freq[val] = (freq[val] || 0) + 1);
        const maxFreq = Math.max(...Object.values(freq));
        return Object.keys(freq).filter(key => freq[key] === maxFreq).map(Number);
    }

    calculateVariance(data) {
        const mean = this.calculateMean(data);
        return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    }

    calculateStandardDeviation(data) {
        return Math.sqrt(this.calculateVariance(data));
    }

    primeFactorization(n) {
        const factors = [];
        let d = 2;
        while (n > 1) {
            while (n % d === 0) {
                factors.push(d);
                n /= d;
            }
            d++;
            if (d * d > n) {
                if (n > 1) factors.push(n);
                break;
            }
        }
        return factors;
    }

    // Additional mathematical functions
    calculateGCD(a, b) {
        let x = Math.abs(a);
        let y = Math.abs(b);
        while (y !== 0) {
            [x, y] = [y, x % y];
        }
        return x;
    }

    calculateLCM(a, b) {
        const gcd = this.calculateGCD(a, b);
        return Math.abs(a * b) / gcd;
    }

    eulerTotient(n) {
        let result = n;
        for (let i = 2; i * i <= n; i++) {
            if (n % i === 0) {
                while (n % i === 0) {
                    n /= i;
                }
                result -= result / i;
            }
        }
        if (n > 1) {
            result -= result / n;
        }
        return result;
    }

    modularInverse(a, m) {
        a = ((a % m) + m) % m;
        for (let x = 1; x < m; x++) {
            if ((a * x) % m === 1) {
                return x;
            }
        }
        return null; // No inverse exists
    }

    chineseRemainderTheorem(remainders, moduli) {
        if (remainders.length !== moduli.length) {
            return null;
        }
        
        let product = 1;
        for (let modulus of moduli) {
            product *= modulus;
        }
        
        let result = 0;
        for (let i = 0; i < remainders.length; i++) {
            const pi = product / moduli[i];
            const inv = this.modularInverse(pi, moduli[i]);
            if (inv === null) {
                return null; // No solution exists
            }
            result = (result + remainders[i] * pi * inv) % product;
        }
        
        return result;
    }

    // Statistical functions
    calculateRange(data) {
        const sorted = data.slice().sort((a, b) => a - b);
        return sorted[sorted.length - 1] - sorted[0];
    }

    calculateQuartiles(data) {
        const sorted = data.slice().sort((a, b) => a - b);
        const n = sorted.length;
        
        const q1 = sorted[Math.floor(n * 0.25)];
        const q2 = sorted[Math.floor(n * 0.5)];
        const q3 = sorted[Math.floor(n * 0.75)];
        
        return { q1, q2, q3 };
    }

    binomialProbability(n, p, k) {
        if (k < 0 || k > n) return 0;
        if (p < 0 || p > 1) return 0;
        
        let result = 1;
        for (let i = 1; i <= k; i++) {
            result *= (n - i + 1) / i;
        }
        return result * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }

    normalProbability(x, mean, std) {
        const z = (x - mean) / std;
        return 0.5 * (1 + this.erf(z / Math.sqrt(2)));
    }

    erf(x) {
        // Approximation of error function
        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;
        
        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);
        
        const t = 1 / (1 + p * x);
        const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
        
        return sign * y;
    }

    poissonProbability(lambda, k) {
        if (lambda <= 0 || k < 0) return 0;
        return (Math.pow(lambda, k) * Math.exp(-lambda)) / this.factorial(k);
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    performTTest(sample1, sample2) {
        const n1 = sample1.length;
        const n2 = sample2.length;
        const mean1 = this.calculateMean(sample1);
        const mean2 = this.calculateMean(sample2);
        const var1 = this.calculateVariance(sample1);
        const var2 = this.calculateVariance(sample2);
        
        const pooledVar = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
        const t = (mean1 - mean2) / Math.sqrt(pooledVar * (1/n1 + 1/n2));
        
        return { t, df: n1 + n2 - 2 };
    }

    performChiSquareTest(observed, expected) {
        if (observed.length !== expected.length) return null;
        
        let chiSquare = 0;
        for (let i = 0; i < observed.length; i++) {
            if (expected[i] !== 0) {
                chiSquare += Math.pow(observed[i] - expected[i], 2) / expected[i];
            }
        }
        
        return chiSquare;
    }

    calculateCorrelation(x, y) {
        if (x.length !== y.length) return null;
        
        const n = x.length;
        const meanX = this.calculateMean(x);
        const meanY = this.calculateMean(y);
        
        let numerator = 0;
        let denomX = 0;
        let denomY = 0;
        
        for (let i = 0; i < n; i++) {
            const dx = x[i] - meanX;
            const dy = y[i] - meanY;
            numerator += dx * dy;
            denomX += dx * dx;
            denomY += dy * dy;
        }
        
        return numerator / Math.sqrt(denomX * denomY);
    }

    // Additional missing functions
    symbolicIntegral(expression, variable) {
        // Basic symbolic integration rules
        const rules = {
            'x^n': 'x^(n+1)/(n+1)',
            'sin(x)': '-cos(x)',
            'cos(x)': 'sin(x)',
            'e^x': 'e^x',
            '1/x': 'ln(x)'
        };
        
        for (let pattern in rules) {
            if (expression.includes(pattern)) {
                return expression.replace(pattern, rules[pattern]) + ' + C';
            }
        }
        return 'Symbolic integration not available';
    }

    numericalLimit(expression, variable, value) {
        // Simple numerical limit calculation
        try {
            const expr = expression.replace(new RegExp(variable, 'g'), value);
            return Function('"use strict"; return (' + expr + ')')();
        } catch (error) {
            return 'Limit calculation not available';
        }
    }

    calculateInverse(matrix) {
        const det = this.calculateDeterminant(matrix);
        if (det === 0) return null; // Matrix is not invertible
        
        if (matrix.length === 2) {
            const [[a, b], [c, d]] = matrix;
            return [[d/det, -b/det], [-c/det, a/det]];
        }
        
        // For larger matrices, use adjugate method
        return this.calculateAdjugate(matrix).map(row => 
            row.map(val => val / det)
        );
    }

    calculateAdjugate(matrix) {
        const n = matrix.length;
        const adj = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const minor = this.getMinor(matrix, i, j);
                adj[j][i] = Math.pow(-1, i + j) * this.calculateDeterminant(minor);
            }
        }
        
        return adj;
    }

    getMinor(matrix, row, col) {
        return matrix.filter((_, i) => i !== row)
                    .map(row => row.filter((_, j) => j !== col));
    }

    calculateEigenvalues(matrix) {
        // Simplified eigenvalue calculation for 2x2 matrices
        if (matrix.length === 2) {
            const [[a, b], [c, d]] = matrix;
            const trace = a + d;
            const det = a * d - b * c;
            const discriminant = trace * trace - 4 * det;
            
            if (discriminant >= 0) {
                const sqrtDisc = Math.sqrt(discriminant);
                return [(trace + sqrtDisc) / 2, (trace - sqrtDisc) / 2];
            } else {
                return 'Complex eigenvalues';
            }
        }
        return 'Eigenvalue calculation for larger matrices not implemented';
    }

    solveLinearSystem(coefficients, constants) {
        // Gaussian elimination for solving linear systems
        const n = coefficients.length;
        const augmented = coefficients.map((row, i) => [...row, constants[i]]);
        
        // Forward elimination
        for (let i = 0; i < n; i++) {
            let maxRow = i;
            for (let k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }
            
            [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
            
            for (let k = i + 1; k < n; k++) {
                const factor = augmented[k][i] / augmented[i][i];
                for (let j = i; j <= n; j++) {
                    augmented[k][j] -= factor * augmented[i][j];
                }
            }
        }
        
        // Back substitution
        const solution = Array(n).fill(0);
        for (let i = n - 1; i >= 0; i--) {
            let sum = 0;
            for (let j = i + 1; j < n; j++) {
                sum += augmented[i][j] * solution[j];
            }
            solution[i] = (augmented[i][n] - sum) / augmented[i][i];
        }
        
        return solution;
    }

    solveTriangle(sides, angles) {
        // Basic triangle solving using law of sines and cosines
        return 'Triangle solving not implemented';
    }

    lawOfCosines(a, b, c) {
        // Calculate angle C given sides a, b, c
        return Math.acos((a * a + b * b - c * c) / (2 * a * b));
    }

    lawOfSines(a, b, A, B) {
        // Calculate side b given side a and angles A, B
        return (b * Math.sin(A)) / Math.sin(B);
    }

    gradientDescent(func, start, learningRate = 0.01, iterations = 1000) {
        // Simple gradient descent optimization
        let x = start;
        for (let i = 0; i < iterations; i++) {
            const h = 0.0001;
            const derivative = (func(x + h) - func(x)) / h;
            x = x - learningRate * derivative;
        }
        return x;
    }

    newtonMethod(func, derivative, start, tolerance = 1e-6) {
        // Newton's method for root finding
        let x = start;
        for (let i = 0; i < 100; i++) {
            const fx = func(x);
            const dfx = derivative(x);
            if (Math.abs(dfx) < tolerance) break;
            
            const newX = x - fx / dfx;
            if (Math.abs(newX - x) < tolerance) break;
            x = newX;
        }
        return x;
    }

    dijkstra(graph, start, end) {
        // Dijkstra's shortest path algorithm
        const distances = {};
        const previous = {};
        const unvisited = new Set();
        
        for (let node in graph) {
            distances[node] = Infinity;
            unvisited.add(node);
        }
        distances[start] = 0;
        
        while (unvisited.size > 0) {
            let current = null;
            let minDistance = Infinity;
            
            for (let node of unvisited) {
                if (distances[node] < minDistance) {
                    minDistance = distances[node];
                    current = node;
                }
            }
            
            if (current === null) break;
            unvisited.delete(current);
            
            for (let neighbor in graph[current]) {
                const distance = distances[current] + graph[current][neighbor];
                if (distance < distances[neighbor]) {
                    distances[neighbor] = distance;
                    previous[neighbor] = current;
                }
            }
        }
        
        return distances[end];
    }

    kruskal(graph) {
        // Kruskal's minimum spanning tree algorithm
        return 'Minimum spanning tree not implemented';
    }

    topologicalSort(graph) {
        // Topological sort for directed acyclic graphs
        return 'Topological sort not implemented';
    }

    generateVisualAids(operation, result) {
        // Generate visual aids for mathematical operations
        return {
            type: 'visual',
            content: `Visual representation for ${operation}`,
            data: result
        };
    }

    generatePracticeProblems(operation) {
        // Generate practice problems for mathematical operations
        return [
            {
                question: `Practice ${operation} problem 1`,
                answer: 'Solution 1'
            },
            {
                question: `Practice ${operation} problem 2`,
                answer: 'Solution 2'
            }
        ];
    }

    // Visualization functions
    createPlot(data, type = 'line', options = {}) {
        if (typeof Plotly !== 'undefined') {
            const defaultOptions = {
                xaxis: { title: 'X' },
                yaxis: { title: 'Y' },
                title: 'MathauraX Plot'
            };
            
            const plotData = [{
                x: data.x || data.map((_, i) => i),
                y: data.y || data,
                type: type,
                mode: type === 'scatter' ? 'markers' : 'lines'
            }];
            
            Plotly.newPlot('plot-container', plotData, { ...defaultOptions, ...options });
            return 'Plot created successfully';
        }
        return 'Plotly.js not available';
    }

    // API Integration for advanced calculations
    async callWolframAlpha(query) {
        // Note: You'll need a Wolfram Alpha API key
        const apiKey = 'YOUR_WOLFRAM_ALPHA_API_KEY';
        const url = `http://api.wolframalpha.com/v1/result?appid=${apiKey}&i=${encodeURIComponent(query)}`;
        
        try {
            const response = await fetch(url);
            return await response.text();
        } catch (error) {
            return `API Error: ${error.message}`;
        }
    }

    // Educational content generation
    generateExplanation(operation, result, steps = []) {
        return {
            operation: operation,
            result: result,
            steps: steps,
            explanation: this.createDetailedExplanation(operation, result, steps),
            visualAids: this.generateVisualAids(operation, result),
            practiceProblems: this.generatePracticeProblems(operation)
        };
    }

    createDetailedExplanation(operation, result, steps) {
        const explanations = {
            'derivative': `The derivative measures the rate of change of a function. It tells us how fast the function is changing at any given point.`,
            'integral': `The integral represents the area under a curve and is the reverse operation of differentiation.`,
            'matrix': `Matrix operations are fundamental in linear algebra and are used to solve systems of equations and transform data.`,
            'statistics': `Statistical measures help us understand and summarize data, making patterns and trends more visible.`
        };
        
        return explanations[operation] || 'This mathematical operation helps us solve complex problems step by step.';
    }

    // Real-world applications
    getRealWorldApplications(operation) {
        const applications = {
            'derivative': [
                'Physics: Velocity and acceleration calculations',
                'Economics: Marginal cost and revenue analysis',
                'Engineering: Optimization problems'
            ],
            'integral': [
                'Physics: Work and energy calculations',
                'Economics: Consumer and producer surplus',
                'Engineering: Area and volume calculations'
            ],
            'statistics': [
                'Business: Market analysis and forecasting',
                'Medicine: Clinical trial analysis',
                'Social Sciences: Survey data analysis'
            ]
        };
        
        return applications[operation] || ['General problem solving', 'Scientific research', 'Data analysis'];
    }
}

// Initialize the math engine
const mathEngine = new MathauraXEngine();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathauraXEngine;
} else {
    window.MathauraXEngine = MathauraXEngine;
    window.mathEngine = mathEngine;
} 