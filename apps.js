const apiKey = "c86jhp2ad3iddpknn4s0";

function getCurrentPrice(){
    const form = document.getElementById('form')
    form.addEventListener('submit', e => {
    e.preventDefault();
    let stock = document.getElementById('input').value.toUpperCase();
    form.reset();
    fetch(`https://finnhub.io/api/v1/quote?symbol=${stock}&token=${apiKey}`) 
    .then(response => response.json())
    .then(stockData => writeData(stockData, stock))
    .then(stockData => getCandleData(stockData,stock));
});
} 

function getCandleData(stockData,stock){
    let previousMonth = Math.round(new Date(new Date().setDate(new Date().getDate()-30))/1000);
    let currDay = Math.round((new Date()).getTime() / 1000);
    fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${stock}&resolution=D&from=${previousMonth}&to=${currDay}&token=${apiKey}`)
    .then(response => response.json())
    .then(candleData => graphData(candleData))
}
function writeData(stockData, stock){
    //gets rid of uneccessary and previous data
    //console.log(stockData.t)
    let table = document.getElementById('stockInfo');
    if(table.rows.length > 1){table.deleteRow(1)}
    //create row and add name and stock data 
    let priceRow = document.createElement('tr');
    let stockName = document.createElement('td')
    stockName.innerText = stock;
    priceRow.appendChild(stockName)
    for(var value in stockData){
        let priceData = document.createElement('td')
        priceData.innerText = stockData[value];
        priceRow.appendChild(priceData);
    }
    stockInfo.appendChild(priceRow);
}

getCurrentPrice();
function graphData(){
    const ctx = document.getElementById('myChart');

    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: '# of Votes',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
