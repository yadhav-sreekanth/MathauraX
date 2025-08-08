# MathauraX AI Assistant
# MathauraX - Interactive Math Learning Platform

MathauraX is an educational platform for learning Algebra, Geometry, Trigonometry, and more.  
Built with HTML, CSS, and JavaScript.


Keywords: math learning, algebra practice, geometry tutorials, CBSE math, math platform

An intelligent mathematical assistant that provides AI-powered responses for mathematical queries when exact matches aren't found in the search database.

## Features

- **AI-Powered Responses**: Uses OpenAI GPT to provide intelligent explanations
- **Mathematical Calculations**: Solves basic math expressions, equations, derivatives, and integrals
- **Topic Detection**: Automatically detects mathematical topics from queries
- **Web Interface**: Simple web UI for testing
- **REST API**: JSON API endpoints for integration
- **CORS Support**: Can be integrated with web applications

## Installation

1. **Clone or download the files**
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up OpenAI API Key** (optional, for AI responses):
   ```bash
   export OPENAI_API_KEY='your-openai-api-key-here'
   ```
   Or create a `.env` file:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```

## Usage

### Running the Server

```bash
python ai_math_assistant.py
```

The server will start on `http://localhost:5000`

### Web Interface

Visit `http://localhost:5000` to use the web interface.

### API Endpoints

#### 1. Ask a Question
```bash
POST /api/ask
Content-Type: application/json

{
    "query": "solve 2x + 5 = 15"
}
```

**Response:**
```json
{
    "success": true,
    "query": "solve 2x + 5 = 15",
    "type": "equation",
    "result": "Solution: x = [5]",
    "explanation": "I solved the equation for you.",
    "timestamp": "2025-01-27T10:30:00"
}
```

#### 2. Get Available Topics
```bash
GET /api/topics
```

#### 3. Health Check
```bash
GET /api/health
```

## Integration with MathauraX

To integrate this with your MathauraX search:

1. **Modify your search.js** to call this API when no results are found
2. **Add this JavaScript to your search function**:

```javascript
// In your search.js, replace the "No results found" message with:
if (results.length === 0) {
    // Call AI assistant
    fetch('http://localhost:5000/api/ask', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query: query})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            searchResults.innerHTML = `
                <div class="ai-response">
                    <h3>🤖 AI Assistant Response</h3>
                    <p><strong>Query:</strong> ${data.query}</p>
                    <div class="ai-result">${data.result}</div>
                    <p><em>${data.explanation}</em></p>
                </div>
            `;
        } else {
            searchResults.innerHTML = '<p>No results found. Try a different search term.</p>';
        }
    })
    .catch(error => {
        searchResults.innerHTML = '<p>No results found. Try a different search term.</p>';
    });
}
```

## Supported Query Types

### 1. Basic Calculations
- `2 + 3 * 4`
- `sqrt(16)`
- `sin(30)`

### 2. Equations
- `solve 2x + 5 = 15`
- `x^2 + 3x + 2 = 0`

### 3. Derivatives
- `derivative of x^2`
- `differentiate sin(x)`

### 4. Integrals
- `integral of x^2`
- `integrate cos(x)`

### 5. Conceptual Questions
- `what is calculus?`
- `explain trigonometry`
- `how to solve quadratic equations?`

## Mathematical Topics Supported

- **Algebra**: Equations, polynomials, factoring
- **Calculus**: Derivatives, integrals, limits
- **Geometry**: Shapes, areas, volumes
- **Trigonometry**: Sine, cosine, tangent
- **Statistics**: Mean, median, probability

## Error Handling

The assistant gracefully handles:
- Invalid mathematical expressions
- Unsupported operations
- Network errors
- API failures

## Security Notes

- Set up proper CORS configuration for production
- Use environment variables for API keys
- Consider rate limiting for production use
- Validate input queries

## Development

To extend the functionality:

1. **Add new mathematical topics** in the `math_topics` dictionary
2. **Implement new solvers** in the `MathAssistant` class
3. **Add new API endpoints** as needed
4. **Customize the AI prompts** for better responses

## License

This project is part of MathauraX educational platform. 