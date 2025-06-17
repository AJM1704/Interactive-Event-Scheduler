async function getStockData() {
    let stockSymbol = document.getElementById("stockSymbol").value.trim();
    
    if (!stockSymbol) {
        alert("enter a stock symbol!");
        return;
    }

    const apiKey = "X12RZD62SZ01V0RB";
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`;

    try {
        let response = await fetch(apiUrl);
        let data = await response.json();

        if (data["Time Series (Daily)"]) {
            let latestDate = Object.keys(data["Time Series (Daily)"])[0];
            let latestData = data["Time Series (Daily)"][latestDate];

            let output = `Stock: ${stockSymbol.toUpperCase()}\n` +
                `Date: ${latestDate}\n` +
                `Open: ${latestData["1. open"]}\n` +
                `High: ${latestData["2. high"]}\n` +
                `Low: ${latestData["3. low"]}\n` +
                `Close: ${latestData["4. close"]}`;


            document.getElementById("apiResponse").value = output;
        } else {
            document.getElementById("apiResponse").value = "limit reached or invalid stock";
        }
    } catch (error) {
        console.error("Error getting data:", error);
        document.getElementById("apiResponse").value = "Error fetching data.";
    }
}