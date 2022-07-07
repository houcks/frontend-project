function getCurrentPrice() {
    const apiKey = ;
    const form = document.getElementById("form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let stock = document.getElementById("input").value.toUpperCase();
        form.reset();
        fetch(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=${apiKey}`)
            .then((response) => response.json())
            .then((stockData) => writeData(stockData, stock))
            .then(getCandleData(stock))
    });
}

function getCandleData(stock) {
    const alphaApi = "16V2RBTG7QGIGOSS";
    fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock}&apikey=${alphaApi}`
    )
        .then((response) => response.json())
        .then((candleData) => graphData(candleData))
        .catch(error => notFound())
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

 //grabs last 30 days and the closing prices from JSON obj
function graphData(closeData) {
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
    }
    chartData(prevDate, prevClose, prevHigh, prevLow);
}

//if chart exists clears chart and prints new one
function chartData(prevDate, prevClose, prevHigh, prevLow) {
    //deletes and creates new chart for canvas
    let chartDiv = document.getElementsByClassName('chart-container')[0];
    if(chartDiv.firstChild){
        document.getElementById('myChart').remove();
        let newCanvas = document.createElement('canvas')
        newCanvas.height = "20vh";
        newCanvas.width = "100vh";
        newCanvas.id = 'myChart';
        chartDiv.appendChild(newCanvas)
    }

    //creates new chart with High, Low, and Close historicals
    const ctx = document.getElementById('myChart');
    new Chart(ctx, {
        data: {
            labels: prevDate.reverse(),
            datasets: [
                {
                    type: 'bar',
                    barThickness: 6,
                    label: 'Previous Low',
                    data: prevLow.reverse(),
                    backgroundColor: "rgba(240, 0, 0, 1.0)"
                },
                {
                    type: 'bar',
                    barThickness: 6,
                    label: 'Previous High',
                    data: prevHigh.reverse(),
                    backgroundColor: "rgba(0, 200, 0, 0.8)"
                },
                {
                    type: 'line',
                    barThickness: 1,
                    label: 'Closing Value',
                    data: prevClose.reverse(),
                    borderColor: 'rgba(255, 255, 255, 1)',
                    backgroundColor: 'rgba(255, 255, 255, 1)'
                },
            ]
        },
        options: {
            elements: {
                line:{
                    borderWidth: 1,
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '30-Day Stock Trend',
                    color: 'rgba(255, 255, 255, 1)'
                },
                legend:{
                    labels:{
                        color: 'rgba(255, 255, 255, 1)',
                        font:{
                            size: 20
                        },
                    },
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false,      
                        borderColor: 'rgba(255, 255, 255, 1)',   
                    },
                    ticks:{
                        color:'rgba(255, 255, 255, 1)',
                        min: (prevLow + prevLow*2),
                        font:{
                            size: 15
                        },     
                    }                  
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        display: false,
                        borderColor: 'rgba(255, 255, 255, 1)',
                    },
                    ticks:{
                        color:'rgba(255, 255, 255, 1)',
                        min: (prevLow + prevLow*2),
                        font:{
                            size: 20
                        },   
                    }              
                }
            },
            responsive: true,
        }
    });
}

function notFound(){
    alert('Stock not found.')
}
getCurrentPrice();


