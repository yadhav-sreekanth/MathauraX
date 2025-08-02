// MathauraX API Integration System
// Connects to various mathematical services and databases

class MathauraXAPIs {
    constructor() {
        this.apis = {
            wolframAlpha: {
                baseUrl: 'http://api.wolframalpha.com/v1/result',
                apiKey: null // Set your API key here
            },
            mathWorld: {
                baseUrl: 'https://mathworld.wolfram.com',
                searchUrl: 'https://mathworld.wolfram.com/search/'
            },
            oeis: {
                baseUrl: 'https://oeis.org',
                apiUrl: 'https://oeis.org/search?q='
            },
            desmos: {
                baseUrl: 'https://www.desmos.com/api/v1.6/calculator',
                embedUrl: 'https://www.desmos.com/calculator/'
            },
            geogebra: {
                baseUrl: 'https://www.geogebra.org/api',
                embedUrl: 'https://www.geogebra.org/material/iframe/id/'
            }
        };
        
        this.cache = new Map();
        this.initializeAPIs();
    }

    initializeAPIs() {
        // Load API keys from environment or config
        this.loadAPIKeys();
        
        // Initialize rate limiting
        this.rateLimits = {
            wolframAlpha: { calls: 0, limit: 1000, resetTime: Date.now() + 86400000 },
            mathWorld: { calls: 0, limit: 10000, resetTime: Date.now() + 86400000 }
        };
    }

    loadAPIKeys() {
        // In a real application, load from environment variables or secure config
        // For now, we'll use placeholder keys
        this.apis.wolframAlpha.apiKey = process.env.WOLFRAM_ALPHA_API_KEY || 'YOUR_API_KEY';
    }

    // Wolfram Alpha Integration
    async queryWolframAlpha(query, format = 'plaintext') {
        if (!this.apis.wolframAlpha.apiKey || this.apis.wolframAlpha.apiKey === 'YOUR_API_KEY') {
            return this.getWolframFallback(query);
        }

        const cacheKey = `wolfram_${query}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const url = `${this.apis.wolframAlpha.baseUrl}?appid=${this.apis.wolframAlpha.apiKey}&i=${encodeURIComponent(query)}&format=${format}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const result = await response.text();
                this.cache.set(cacheKey, result);
                return result;
            } else {
                return this.getWolframFallback(query);
            }
        } catch (error) {
            console.error('Wolfram Alpha API Error:', error);
            return this.getWolframFallback(query);
        }
    }

    getWolframFallback(query) {
        // Fallback responses for common mathematical queries
        const fallbacks = {
            'derivative of x^2': 'The derivative of x² is 2x',
            'integral of x': 'The integral of x is (x²)/2 + C',
            'solve x^2 + 5x + 6 = 0': 'x = -2 or x = -3',
            'prime factors of 100': '2² × 5²',
            'sqrt(16)': '4',
            'factorial of 5': '120',
            'pi': 'π ≈ 3.14159...',
            'e': 'e ≈ 2.71828...'
        };

        const lowerQuery = query.toLowerCase();
        for (let key in fallbacks) {
            if (lowerQuery.includes(key.toLowerCase())) {
                return fallbacks[key];
            }
        }

        return `I can help with mathematical queries like derivatives, integrals, equations, and more. Try asking something specific like "derivative of x^2" or "solve x^2 + 5x + 6 = 0".`;
    }

    // MathWorld Integration
    async searchMathWorld(query) {
        const cacheKey = `mathworld_${query}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const searchUrl = `${this.apis.mathWorld.searchUrl}${encodeURIComponent(query)}`;
            const response = await fetch(searchUrl);
            
            if (response.ok) {
                const html = await response.text();
                const results = this.parseMathWorldResults(html);
                this.cache.set(cacheKey, results);
                return results;
            }
        } catch (error) {
            console.error('MathWorld API Error:', error);
        }

        return this.getMathWorldFallback(query);
    }

    parseMathWorldResults(html) {
        // Parse MathWorld search results
        const results = [];
        const regex = /<a href="([^"]+)">([^<]+)<\/a>/g;
        let match;
        
        while ((match = regex.exec(html)) !== null) {
            if (match[1].includes('/')) {
                results.push({
                    title: match[2],
                    url: `${this.apis.mathWorld.baseUrl}${match[1]}`,
                    description: this.extractDescription(html, match[1])
                });
            }
        }
        
        return results.slice(0, 5); // Return top 5 results
    }

    extractDescription(html, url) {
        // Extract description from MathWorld page
        const startIndex = html.indexOf(url);
        if (startIndex !== -1) {
            const endIndex = html.indexOf('</p>', startIndex);
            if (endIndex !== -1) {
                return html.substring(startIndex, endIndex).replace(/<[^>]*>/g, '').trim();
            }
        }
        return '';
    }

    getMathWorldFallback(query) {
        const concepts = {
            'derivative': {
                title: 'Derivative',
                description: 'The derivative of a function measures the rate of change of the function with respect to its variable.',
                url: 'https://mathworld.wolfram.com/Derivative.html'
            },
            'integral': {
                title: 'Integral',
                description: 'An integral is a mathematical object that can be interpreted as an area or a generalization of area.',
                url: 'https://mathworld.wolfram.com/Integral.html'
            },
            'matrix': {
                title: 'Matrix',
                description: 'A matrix is a rectangular array of numbers, symbols, or expressions arranged in rows and columns.',
                url: 'https://mathworld.wolfram.com/Matrix.html'
            }
        };

        const lowerQuery = query.toLowerCase();
        for (let key in concepts) {
            if (lowerQuery.includes(key)) {
                return [concepts[key]];
            }
        }

        return [{
            title: 'Mathematical Concepts',
            description: 'Search for mathematical concepts, formulas, and definitions.',
            url: 'https://mathworld.wolfram.com/'
        }];
    }

    // OEIS (Online Encyclopedia of Integer Sequences) Integration
    async searchOEIS(query) {
        const cacheKey = `oeis_${query}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const url = `${this.apis.oeis.apiUrl}${encodeURIComponent(query)}&fmt=json`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                const results = this.parseOEISResults(data);
                this.cache.set(cacheKey, results);
                return results;
            }
        } catch (error) {
            console.error('OEIS API Error:', error);
        }

        return this.getOEISFallback(query);
    }

    parseOEISResults(data) {
        if (!data.results) return [];
        
        return data.results.slice(0, 5).map(result => ({
            id: result.number,
            name: result.name,
            sequence: result.data,
            description: result.comment,
            url: `${this.apis.oeis.baseUrl}/A${result.number.toString().padStart(6, '0')}`
        }));
    }

    getOEISFallback(query) {
        const sequences = {
            'fibonacci': {
                id: 'A000045',
                name: 'Fibonacci numbers',
                sequence: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...],
                description: 'The Fibonacci sequence where each number is the sum of the two preceding ones.'
            },
            'prime': {
                id: 'A000040',
                name: 'Prime numbers',
                sequence: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, ...],
                description: 'The sequence of prime numbers.'
            }
        };

        const lowerQuery = query.toLowerCase();
        for (let key in sequences) {
            if (lowerQuery.includes(key)) {
                return [sequences[key]];
            }
        }

        return [];
    }

    // Desmos Integration for Graphing
    async createDesmosGraph(expression, options = {}) {
        const defaultOptions = {
            xmin: -10,
            xmax: 10,
            ymin: -10,
            ymax: 10,
            grid: true,
            axes: true
        };

        const config = { ...defaultOptions, ...options };
        const graphUrl = `${this.apis.desmos.embedUrl}?embed&xmin=${config.xmin}&xmax=${config.xmax}&ymin=${config.ymin}&ymax=${config.ymax}`;
        
        return {
            url: graphUrl,
            embedCode: `<iframe src="${graphUrl}" width="600" height="400" frameborder="0"></iframe>`,
            expression: expression
        };
    }

    // GeoGebra Integration
    async createGeoGebraApplet(commands, options = {}) {
        const defaultOptions = {
            width: 600,
            height: 400,
            borderColor: '#000000',
            enableLabelDrags: false,
            enableShiftDragZoom: true,
            enableRightClick: false,
            showAlgebraInput: true,
            showMenuBar: false,
            showToolBar: true,
            showToolBarHelp: false,
            useBrowserForJS: false
        };

        const config = { ...defaultOptions, ...options };
        const appletUrl = `${this.apis.geogebra.embedUrl}${Date.now()}`;
        
        return {
            url: appletUrl,
            embedCode: `<iframe src="${appletUrl}" width="${config.width}" height="${config.height}" frameborder="0"></iframe>`,
            commands: commands
        };
    }

    // Mathematical Database Integration
    async searchMathematicalDatabase(query, database = 'all') {
        const databases = {
            'all': ['wolfram', 'mathworld', 'oeis'],
            'wolfram': ['wolfram'],
            'mathworld': ['mathworld'],
            'oeis': ['oeis']
        };

        const selectedDBs = databases[database] || databases['all'];
        const results = {};

        for (let db of selectedDBs) {
            switch (db) {
                case 'wolfram':
                    results.wolfram = await this.queryWolframAlpha(query);
                    break;
                case 'mathworld':
                    results.mathworld = await this.searchMathWorld(query);
                    break;
                case 'oeis':
                    results.oeis = await this.searchOEIS(query);
                    break;
            }
        }

        return results;
    }

    // Educational Content API
    async getEducationalContent(topic, level = 'intermediate') {
        const content = {
            'calculus': {
                beginner: {
                    title: 'Introduction to Calculus',
                    topics: ['Limits', 'Derivatives', 'Integrals'],
                    resources: [
                        'https://www.khanacademy.org/math/calculus-1',
                        'https://www.mathsisfun.com/calculus/'
                    ]
                },
                intermediate: {
                    title: 'Intermediate Calculus',
                    topics: ['Chain Rule', 'Integration by Parts', 'Applications'],
                    resources: [
                        'https://www.wolframalpha.com/examples/mathematics/calculus',
                        'https://mathworld.wolfram.com/Calculus.html'
                    ]
                },
                advanced: {
                    title: 'Advanced Calculus',
                    topics: ['Multivariable Calculus', 'Vector Calculus', 'Differential Equations'],
                    resources: [
                        'https://www.mathworld.wolfram.com/VectorCalculus.html',
                        'https://www.wolframalpha.com/examples/mathematics/vector-analysis'
                    ]
                }
            },
            'algebra': {
                beginner: {
                    title: 'Basic Algebra',
                    topics: ['Linear Equations', 'Quadratic Equations', 'Polynomials'],
                    resources: [
                        'https://www.khanacademy.org/math/algebra',
                        'https://www.mathsisfun.com/algebra/'
                    ]
                },
                intermediate: {
                    title: 'Intermediate Algebra',
                    topics: ['Systems of Equations', 'Matrices', 'Complex Numbers'],
                    resources: [
                        'https://www.wolframalpha.com/examples/mathematics/algebra',
                        'https://mathworld.wolfram.com/Algebra.html'
                    ]
                },
                advanced: {
                    title: 'Abstract Algebra',
                    topics: ['Group Theory', 'Ring Theory', 'Field Theory'],
                    resources: [
                        'https://www.mathworld.wolfram.com/GroupTheory.html',
                        'https://www.wolframalpha.com/examples/mathematics/abstract-algebra'
                    ]
                }
            }
        };

        return content[topic]?.[level] || {
            title: 'Mathematical Topic',
            topics: ['General Mathematics'],
            resources: ['https://www.wolframalpha.com/', 'https://mathworld.wolfram.com/']
        };
    }

    // Real-time Mathematical News and Updates
    async getMathematicalNews() {
        // This would typically connect to RSS feeds or news APIs
        return [
            {
                title: 'Latest Mathematical Discoveries',
                source: 'Mathematical News',
                url: 'https://www.ams.org/news',
                date: new Date().toISOString()
            },
            {
                title: 'Mathematical Research Updates',
                source: 'Research News',
                url: 'https://arxiv.org/list/math/recent',
                date: new Date().toISOString()
            }
        ];
    }

    // Cache management
    clearCache() {
        this.cache.clear();
    }

    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// Initialize the API system
const mathAPIs = new MathauraXAPIs();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MathauraXAPIs;
} else {
    window.MathauraXAPIs = MathauraXAPIs;
    window.mathAPIs = mathAPIs;
} 