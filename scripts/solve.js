document.getElementById("solveBtn").addEventListener("click", async () => {
    const input = document.getElementById("mathInput").value.trim();
    if (!input) {
      alert("Please enter a math problem.");
      return;
    }
  
    const res = await fetch("http://localhost:5000/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem: input }),
    });
  
    const data = await res.json();
    document.getElementById("solutionOutput").innerHTML =
      `<h3>Solution:</h3><p>${data.solution}</p>`;
  });  