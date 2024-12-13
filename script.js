document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("option-form");
    const resultDiv = document.getElementById("result");
    const saveButton = document.getElementById("save-btn");
    const savedDataDiv = document.getElementById("saved-data");
    let lastCalculation = null; 
  

    loadSavedData();
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
  
      const stockPrice = parseFloat(document.getElementById("stock-price").value);
      const strikePrice = parseFloat(document.getElementById("strike-price").value);
      const timeToMaturity = parseFloat(document.getElementById("time-to-maturity").value);
      const volatility = parseFloat(document.getElementById("volatility").value) / 100;
      const riskFreeRate = parseFloat(document.getElementById("risk-free-rate").value) / 100;
  
      const optionPrice = calculateOptionPrice(stockPrice, strikePrice, timeToMaturity, volatility, riskFreeRate);
      resultDiv.textContent = `Calculated Option Price: $${optionPrice.toFixed(2)}`;
  
      lastCalculation = { stockPrice, strikePrice, timeToMaturity, volatility, riskFreeRate, optionPrice };
      saveButton.style.display = "block";
    });
  
    saveButton.addEventListener("click", () => {
      if (lastCalculation) {
        saveCalculation(lastCalculation);
        saveButton.style.display = "none"; 
      }
    });
  
    function calculateOptionPrice(S, K, T, sigma, r) {
      const d1 = (Math.log(S / K) + (r + (sigma ** 2) / 2) * T) / (sigma * Math.sqrt(T));
      const d2 = d1 - sigma * Math.sqrt(T);
      const N = (x) => 0.5 * (1 + erf(x / Math.sqrt(2)));
      return S * N(d1) - K * Math.exp(-r * T) * N(d2);
    }
  
    function erf(x) {
      const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
      const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
      const sign = x < 0 ? -1 : 1;
      x = Math.abs(x);
      const t = 1 / (1 + p * x);
      const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
      return sign * y;
    }
  
    function saveCalculation(calculation) {
      const savedCalculations = JSON.parse(localStorage.getItem("savedCalculations")) || [];
      savedCalculations.push(calculation);
      localStorage.setItem("savedCalculations", JSON.stringify(savedCalculations));
      displaySavedCalculations();
    }
  
    function loadSavedData() {
      displaySavedCalculations();
    }
  
    function displaySavedCalculations() {
      const savedCalculations = JSON.parse(localStorage.getItem("savedCalculations")) || [];
      if (savedCalculations.length === 0) {
        savedDataDiv.innerHTML = "<p>No calculations saved yet.</p>";
        return;
      }
  
      savedDataDiv.innerHTML = savedCalculations
        .map((calc, index) => `
          <div class="saved-calculation">
            <p><strong>Calculation ${index + 1}</strong></p>
            <p>Stock Price: $${calc.stockPrice.toFixed(2)}</p>
            <p>Strike Price: $${calc.strikePrice.toFixed(2)}</p>
            <p>Time to Maturity: ${calc.timeToMaturity} years</p>
            <p>Volatility: ${calc.volatility.toFixed(2)}%</p>
            <p>Risk-Free Rate: ${calc.riskFreeRate.toFixed(2)}%</p>
            <p>Option Price: $${calc.optionPrice.toFixed(2)}</p>
            <button class="visualize-button" onclick="visualizeCalculation(${index})">Visualize</button>
            <div class="visualization" id="visualization-${index}">
              <canvas id="chart-${index}" width="400" height="200"></canvas>
            </div>
          </div>
        `)
        .join("");
    }
  
    window.visualizeCalculation = (index) => {
      const visualizationDiv = document.getElementById(`visualization-${index}`);
      const chartCanvas = document.getElementById(`chart-${index}`);
      if (visualizationDiv.style.display === "block") {
        visualizationDiv.style.display = "none";
        return;
      }
  
      visualizationDiv.style.display = "block";
  
      
      const labels = Array.from({ length: 21 }, (_, i) => i - 10 + 150); 
      const data = labels.map((price) => calculateOptionPrice(price, 150, 1, 0.2, 0.05));
  
      new Chart(chartCanvas, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Option Price Sensitivity",
            data,
            borderColor: "#004080",
            borderWidth: 2,
            fill: false,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Option Price vs Stock Price",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Stock Price ($)",
              },
            },
            y: {
              title: {
                display: true,
                text: "Option Price ($)",
              },
            },
          },
        },
      });
    };
  });

 document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-btn");
    const calculationSection = document.getElementById("calculation-section");
  
    startButton.addEventListener("click", () => {
      calculationSection.scrollIntoView({ behavior: "smooth" });
    });
  });
    