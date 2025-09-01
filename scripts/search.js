document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    const mathTopics = [
        { title: "Algebra Basics", url: "topics/algebra.html", description: "Introduction to algebraic expressions and equations", subtopics: ["Expressions", "Equations", "Inequalities", "Factoring"] },
        { title: "Geometry Fundamentals", url: "topics/geometry.html", description: "Basic concepts of points, lines, and angles", subtopics: ["Lines", "Angles", "Shapes", "Area", "Volume"] },
        { title: "Calculus: Derivatives", url: "topics/calculus.html", description: "Understanding rates of change and differentiation", subtopics: ["Limits", "Derivatives", "Chain Rule", "Applications"] },
        { title: "Probability Theory", url: "topics/probability.html", description: "Fundamentals of probability and statistics", subtopics: ["Combinations", "Events", "Bayes Theorem", "Experiments"] },
        { title: "Trigonometry", url: "topics/trigonometry.html", description: "Fundamentals of triangle", subtopics: ["Sine", "Cosine", "Tangent", "Identities"] },
        { title: "Arithmetics", url: "topics/arithmetic.html", description: "Learn basic arithmetic operations", subtopics: ["Addition", "Subtraction", "Multiplication", "Division"] },
        { title: "Combinatorics", url: "topics/combinatorics.html", description: "Learn basic combinatorics operations", subtopics: ["Permutations", "Combinations", "Pigeonhole Principle"] },
        { title: "Number Theory", url: "topics/numbertheory.html", description: "Learn basic number theory operations", subtopics: ["Primes", "GCD", "Divisibility", "Modular Arithmetic"] },
        { title: "Discrete Mathematics", url: "topics/discrete-mathematics.html", description: "Learn basic discrete mathematics operations", subtopics: ["Logic", "Graphs", "Sets", "Proofs"] },
        { title: "Fractions", url: "topics/fractions.html", description: "Learn basic fractions operations", subtopics: ["Addition", "Subtraction", "Simplifying"] },
        { title: "Equations", url: "topics/equations.html", description: "Learn basic equations operations", subtopics: ["Linear", "Quadratic", "Polynomial"] },
        { title: "Numbers", url: "topics/numbers.html", description: "Learn basic numbers operations", subtopics: ["Integers", "Whole Numbers", "Rational Numbers"] },
        { title: "Percentages", url: "topics/percentage.html", description: "Learn basic percentages operations", subtopics: ["Increase", "Decrease", "Conversion"] },
        { title: "Decimals", url: "topics/decimal.html", description: "Learn basic decimals operations", subtopics: ["Place Value", "Addition", "Subtraction"] },
        { title: "Game Theory", url: "topics/game-theory.html", description: "Learn basic game theory operations", subtopics: ["Strategies", "Payoffs", "Nash Equilibrium"] },
        { title: "Statistics", url: "topics/statistics.html", description: "Learn basic statistics operations", subtopics: ["Mean", "Median", "Mode", "Graphs"] },
        { title: "Differential Equations", url: "topics/differential-equations.html", description: "Learn basic Differential Equations", subtopics: ["First Order", "Second Order", "Applications"] },
        { title: "Logic", url: "topics/logic.html", description: "Learn basic logical operations", subtopics: ["Truth Tables", "Propositional Logic", "Negation"] },
        { title: "Mathematical Physics", url: "topics/mathematical-physics.html", description: "Learn basic mathematical-physics", subtopics: ["Mechanics", "Differential Equations", "Vectors"] },
        { title: "Measurement", url: "topics/measurement.html", description: "Learn basic measurement operations", subtopics: ["Length", "Area", "Volume", "Temperature"] },
        { title: "Order of Operations", url: "topics/order-of-operations.html", description: "Learn basic order of operations", subtopics: ["PEMDAS", "BODMAS", "Parentheses"] },
        { title: "Postulates and Axioms", url: "topics/postulates-axioms.html", description: "Learn basic postulates and axioms", subtopics: ["Euclidean Geometry", "Non-Euclidean Geometry", "Hilbert's Axioms", "Euclidean Axioms"] },
        { title: "Linear Algebra", url: "topics/linear-algebra.html", description: "Learn basic linear algebra operations", subtopics: ["Vectors", "Matrices", "Systems of Equations", "Eigenvalues", "Eigenvectors", "Linear Transformations", "Linear Independence", "Linear Dependence", "Linear Operator", "Linear Function", "Linear Equation", "Linear Inequality", "Linear System", "Linear Space", "Linear Subspace", "Linear Transformation Matrix", "Linear Transformation Vector"]},
        { title: "Bodmas", url: "topics/bodmas.html", description: "Learn basic bodmas operations", subtopics: ["BODMAS", "PEMDAS", "Parentheses"] },
    
    ];

  
  function searchFunction() {
    let query = document.getElementById("searchInput").value;
    alert("Searching for: " + query); // Replace this with real search logic
  }

    // Initially hide search results
    searchResults.style.display = 'none';

    searchButton.addEventListener('click', performSearch);
    
    // Remove the input event listener to only search on button click
    // searchInput.addEventListener('input', performSearch);

    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            searchResults.innerHTML = '<p>Please enter a search term</p>';
            searchResults.style.display = 'block';
            return;
        }

        // Get the first letter of the search query
        const firstLetter = query.charAt(0);

        const results = mathTopics.filter(topic => {
            // Check if topic title starts with the first letter
            const titleStartsWithLetter = topic.title.toLowerCase().startsWith(firstLetter);
            
            // Check if any subtopic starts with the first letter
            const subtopicStartsWithLetter = topic.subtopics && 
                topic.subtopics.some(sub => sub.toLowerCase().startsWith(firstLetter));
            
            // Check if description contains the query
            const descriptionContainsQuery = topic.description.toLowerCase().includes(query);
            
            return titleStartsWithLetter || subtopicStartsWithLetter || descriptionContainsQuery;
        });

        // Show search results
        searchResults.style.display = 'block';

        if (results.length === 0) {
            searchResults.innerHTML = `
                <p>No results found starting with "${firstLetter}". Try a different search term.</p>
                <button id="askAIButton" style="margin-top:1em; padding:0.7em 1.5em; border-radius:10px; background:linear-gradient(90deg,#5A65EA,#9C4BE7);color:#fff;font-weight:600;border:none;cursor:pointer;">Ask MathauraX AI</button>
            `;
            document.getElementById('askAIButton').onclick = function() {
                document.getElementById('aiQuery').value = query;
                document.getElementById('aiQuery').focus();
                // Optionally, auto-submit to AI:
                // askAI();
            };
            return;
        }

const resultsHTML = results.map(topic => `
    <div class="search-result" style="background: #fff; border-radius: 14px; padding: 1.5rem; margin-bottom: 1.2rem; box-shadow: 0 4px 16px rgba(25,90,202,0.08); border-left: 5px solid #195acd; transition: box-shadow 0.2s;">
        <h3 style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">
            <a href="${topic.url}" style="color: #195acd; text-decoration: none; font-weight: 700; transition: color 0.2s;" onmouseover="this.style.color='#764ba2'" onmouseout="this.style.color='#195acd'">
                ${topic.title}
            </a>
        </h3>
        <p style="margin: 0 0 0.7rem 0; color: #444; font-size: 1rem;">${topic.description}</p>
        <div style="margin-top: 0.5rem;">
            <strong style="color: #007bff; font-size: 0.95rem;">Subtopics:</strong>
            <span style="display: inline-flex; flex-wrap: wrap; gap: 0.4rem; margin-left: 0.5rem;">
                ${topic.subtopics.map(sub => `<span class="subtopic-chip">${sub}</span>`).join('')}
            </span>
        </div>
    </div>
`).join('');


        searchResults.innerHTML = resultsHTML;
    }
});

