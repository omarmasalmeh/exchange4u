//Omar Almasalmeh - PROG2700 - Final Assignment 2022/16/04

//Resources Used
//https://www.w3resource.com/javascript-exercises/javascript-dom-exercise-7.php
//https://code-examples.net/en/q/26336eb
(function () {
    // convert currency button
    var bContainer = document.querySelector('div.inputSelect');
    var button = document.createElement("button");
    bContainer.appendChild(button)
    button.id = 'cButton'
    button.innerText = "Convert"
    //when user click call get currency function
    button.onclick = getCurrency;
    //get latest function arrays
    let latestV = [];
    let latestC = [];
    let latestN = [];
    //getcurrency function arrays
    let fdates = [];
    let fvalue = [];
    let dates = [];
    let valueT = [];
    //getSymbols function arrays
    let currNames = [];
    let currCodes = [];
    //top ten list array used is getLatest function
    let topTen = ['CNY', 'SEK', 'EUR', 'CHF', 'INR', 'JPY', 'AUD', 'USD', 'CAD', 'KWD'];
    //this function to get the latest values from the selected currency to top ten currencies list 
    function getLatest() {
        //reset the arrays
        latestV = [];
        latestC = [];
        //get the values of amount and currency from inputs
        var amount = [document.getElementById('myText').value].join("")
        var fromCurrency = [document.getElementById('val1').value].join("")
        //modify the request link before getting the data
        var requestURL = `https://api.exchangerate.host/latest?base=${fromCurrency}&amount=${amount}&places=2`;
        var request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();
        //onload function
        request.onload = function () {
            //data response variable
            var response = request.response;
            //latest currencies rates
            let latestValues = response.rates;
            //filter function to only get the data that match the top ten array and return a new object
            const filtered = Object.keys(latestValues)
                .filter(key => topTen.includes(key))
                .reduce((obj, key) => {
                    obj[key] = latestValues[key];
                    return obj;
                }, {});
            //convert the object to an array to use for each loop
            let filteredCurr = [filtered];
            //for each loop to get the keys and values and puch each of them into a loop
            filteredCurr.forEach(code => {
                for (const key in code) {
                    latestC.push(key)
                    latestV.push(code[key])
                }
            });
            //get the currency codes array and convert it into a lowercase array and use it to get the flags
            const lowerCodes = latestC.map(name => name.toLowerCase());
            //jQuery remove and append table to prevent redundant data
            $("table#table").remove();
            $("h6#title").remove();
            $("div#currTable").append('<table id="table" ></table>');
            $("div#currTable").prepend('<h6 id="title">Same amount in the latest top ten values</h6>');
            //for loop to create a row and column for the top ten list table
            for (var r = 0; r < parseInt(lowerCodes.length); r++) {
                //insert two rows one for flags with names and codes and the other is for values
                var x = document.getElementById('table').insertRow(r);
                var newR = document.getElementById('table').insertRow(r);
                //inserting the columns 
                for (var c = 0; c < 1; c++) {
                    //insert the values
                    var cl = x.insertCell(newR);
                    //create diffrent variables to hold the names, codes, and values
                    var code = latestC[r];
                    var locode = lowerCodes[r];
                    var names = latestN[r];
                    var value = latestV[r];
                    //insert the names and codes 
                    var y = x.insertCell(c);
                    let currCell = '&nbsp;' + `<div class="currency-flag currency-flag-${locode}"></div>` + '&nbsp;' + `${names}` + `(${code})` + '&nbsp;'
                    let val = `${value}`
                    cl.innerHTML = val;
                    y.innerHTML = currCell;
                }
            }
        }
    }
    //this function to get the dropdown list content and currency symbols
    function getSymbols() {
        //link to get the symbols (Full name and codes) of each currency
        var requestURL = 'https://api.exchangerate.host/symbols';
        var request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();
        //onload function
        request.onload = function () {
            //data response variable
            var response = request.response;
            //convert the object to an array to use for each loop
            let sData = [response.symbols]
            //for each loop to get the full names and codes of each currency
            sData.forEach(m => {
                for (const key in m) {
                    currNames.push(m[key].description);
                    currCodes.push(m[key].code);
                }
            });
            //resposnse object variable
            let filteredS = response.symbols
            //filter function to only get the full names that match the top ten array and return a new object
            const filteredSym = Object.keys(filteredS)
                .filter(key => topTen.includes(key))
                .reduce((obj, key) => {
                    obj[key] = filteredS[key];
                    return obj;
                }, {});
            //convert the object to an array to use for each loop
            let filteredSymbol = [filteredSym]
            //foreach loop to push the filtered full names into an array
            filteredSymbol.forEach(sym => {
                for (const val in sym) {
                    latestN.push(sym[val].description);
                }
            });
            //create new variables to be used inside another loop
            let listNames = currNames;
            let codes = currCodes;
            //create a new variable to get the datalist tag for from currency
            select1 = document.getElementById('currency1');
            //for loop to insert the option tags with  currencies names and codes into the datalist
            for (var i = 0; i < parseInt(currNames.length); i++) {
                var opt = document.createElement('option');
                opt.value = codes[i];
                opt.innerText = listNames[i] + ' ' + `(${codes[i]})`;
                opt.className = "options1";
                select1.appendChild(opt);
            }
            //create a new variable to get the datalist tag for to currency
            select = document.getElementById('currency2');
            //for loop to insert the option tags with  currencies names and codes into the datalist
            for (var i = 0; i < parseInt(currCodes.length); i++) {
                var opt = document.createElement('option');
                opt.value = codes[i];
                opt.innerText = listNames[i] + ' ' + `(${codes[i]})`
                opt.className = "options2"
                select.appendChild(opt);
            }
        }
    }
    //calling the function get symbols
    getSymbols()
    //create a chart function
    function createChart() {
        //jQuery remove and append canvas to prevent redundant chart data
        $("canvas#myChart").remove();
        $("div.chartContainer").append('<canvas id="myChart" height= "450" width= "650"></canvas>');
        //get the canvas tag after creation 
        const ctx = document.getElementById('myChart');
        //create a new chart with custom color and background
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'value',
                    data: fvalue,
                    backgoundColor: 'rgba(255, 0, 0, 0.2)',
                    borderColor: "#3e95cd",
                    borderWidth: 3
                }]
            },
            options: {
                elements: {
                    line: {
                        tension: 0
                    }
                },
                animation: {
                    duration: 0
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    //this function to get the chart data from the api and push them into an arrays
    function getCurrency() {
        //reset the arrays
        // fdates = []
        fvalue = []
        dates = []
        valueT = []
        //getting the data from input and option tags to modify the api link
        var amount = [document.getElementById('myText').value].join("")
        var fromCurrency = [document.getElementById('val1').value].join("")
        var toCurrency = [document.getElementById('val2').value].join("")
        var dateStart = [document.getElementById('startDate').value].join("")
        var dateEnd = [document.getElementById('endDate').value].join("")
        //create a custom link accourding to the user selection
        let linkDate = `https://api.exchangerate.host/timeseries?start_date=${dateStart}&end_date=${dateEnd}&base=${fromCurrency}&symbols=${toCurrency}&amount=${amount}&places=2`;
        var requestURL = linkDate;
        var request = new XMLHttpRequest();
        request.open('GET', requestURL);
        request.responseType = 'json';
        request.send();
        //onload function
        request.onload = function () {
            //store the response in a variable
            var response = request.response;
            //convert the response object into an array to use foreach loop
            let rData = [response.rates]
            //loop to get the dates and the values and push them into two arrays
            rData.forEach(rate => {
                for (const key in rate) {
                    dates.push(key);
                    valueT.push(rate[key]);
                }
            });
            // //push the index of the data to use it for the chart x index
            // for (let i = 0; i < dates.length; i++) {
            //     fdates.push(i)
            // }
            //get the values only from the data array
            valueT.forEach(data => {
                for (const val in data) {
                    fvalue.push(data[val])
                }
            })
            //call the get latest function to get teg top ten data
            getLatest()
            //call createChart function to display the chart
            createChart()
            //if the canvas not created yet go back
            if (!this.canvas) return;
        }
    }
})()