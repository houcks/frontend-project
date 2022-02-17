const apiKey = "c86jhp2ad3iddpknn4s0";
const alphaApi = "16V2RBTG7QGIGOSS";
function getCurrentPrice() {
  const form = document.getElementById("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let stock = document.getElementById("input").value.toUpperCase();
    form.reset();
    fetch(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=${apiKey}`)
      .then((response) => response.json())
      .then((stockData) => writeData(stockData, stock))
      .then(getCandleData(stock));
  });
}

function getCandleData(stock) {
  let previousMonth = Math.round(
    new Date(new Date().setDate(new Date().getDate() - 30)) / 1000
  );
  let currDay = Math.round(new Date().getTime() / 1000);
  fetch(
    `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=${alphaApi}`
  )
    .then((response) => response.json())
    .then((candleData) => graphData(candleData));
}
function writeData(stockData, stock) {
  //gets rid of uneccessary and previous data
  delete stockData.t;
  let table = document.getElementById("stockInfo");
  if (table.rows.length > 1) {
    table.deleteRow(1);
  }
  //create row and add name and stock data
  let priceRow = document.createElement("tr");
  let stockName = document.createElement("td");
  stockName.innerText = stock;
  priceRow.appendChild(stockName);
  for (var value in stockData) {
    let priceData = document.createElement("td");
    priceData.innerText = stockData[value];
    priceRow.appendChild(priceData);
  }
  stockInfo.appendChild(priceRow);
}

getCurrentPrice();
function graphData(closeData) {
  //grabs last 30 days and the closing prices from JSON obj
  let prevDate = [];
  let prevHigh = [];
  let prevLow = [];
  let prevClose = [];
  
  let keys = Object.keys(closeData["Time Series (Daily)"]);
  for (var i = 0; i < 30; i++) {
    let day = keys[i];
    let high = closeData["Time Series (Daily)"][keys[i]]["2. high"];
    let low = closeData["Time Series (Daily)"][keys[i]]["3. low"];
    let close = closeData["Time Series (Daily)"][keys[i]]["4. close"];
    prevDate.push(day);
    prevClose.push(close);
    prevLow.push([low, close]);
    prevHigh.push([close, high]);
   // prevClose.push(close);
  }
  chartData(prevDate, prevClose, prevHigh, prevLow);
}

function chartData(prevDate, prevClose, prevHigh, prevLow){
    const ctx = document.getElementById('myChart');
    console.log(prevClose)
    new Chart(ctx, {
        
        data: {
          labels: prevDate,
          datasets: [
            { 
                type: 'bar',
                label: 'Previous Low',
                data: prevLow,
                backgroundColor: "rgba(240, 0, 0, 1.0)"
            },
            {
                type: 'bar',
                label: 'Previous High',
                data: prevHigh,
                backgroundColor: "rgba(0, 200, 0, 0.8)"
            },
            {
                type:'line',
                label: 'Closing Value',
                data: prevClose,
                borderColor: 'rgba(255, 255, 255, 1)',
                backgroundColor: 'rgba(255, 255, 255, 1)'
            },
          ]
        },
        options: {
            plugins:{
                title: {
                    display: true,
                    text: '30-Day Stock Trend',
                    color: 'rgba(255, 255, 255, 1)'
                  }
            },
            responsive: false,
            //maintainAspectRatio: false
        }
      });
}

new Chart(document.getElementById("bar-chart-horizontal"), {
    type: 'horizontalBar',
    data: {
      labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
      datasets: [
        {
          label: "Population (millions)",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          data: [2478,5267,734,784,433]
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Predicted world population (millions) in 2050'
      }
    }
});