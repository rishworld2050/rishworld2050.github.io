var stkApp = angular.module("stockApp", ['ngWebSocket']);
stkApp.factory('FetchSocketData', ["$websocket", function($websocket) {
    var dataStream = $websocket('ws://stocks.mnet.website');
    var collection = [];
    dataStream.onMessage(function(message) {
        //Push the current stream to the top of the array
        collection[0] = JSON.parse(message.data);
    });
    var factory = {
        data: collection,
        get: function() {
            dataStream.send(JSON.stringify({
                action: 'get'
            }));
        }
    };
    return factory;
}]);
stkApp.controller('StockController', ["FetchSocketData", "$scope", function(FetchSocketData, $scope) {
    $scope.currentChartView = '';
    $scope.chartData = {};
    $scope.stockData = {};
    $scope.test = FetchSocketData;
    setInterval(function() {
        $scope.processData(angular.copy($scope.test.data[0]));
    }, 1000);
    $scope.processData = function(dataArray) {
        var fPrice;
        if(dataArray!==undefined){
        dataArray.forEach(([name, price]) => {
            fPrice = parseFloat(`${price}`);
            if (!$scope.stockData.hasOwnProperty(`${name}`)) {
                $scope.stockData[`${name}`] = {
                    "name": `${name}`,
                    "price": fPrice,
                    "color": "white",
                    "delta": "0",
                    "timestamp": new Date().toLocaleString()
                };
                if (!$scope.chartData.hasOwnProperty(`${name}`)) {
                    $scope.chartData[`${name}`] = [];
                    $scope.chartData[`${name}`].push(["Index", "Price"]);
                    $scope.chartData[`${name}`].push([$scope.chartData[`${name}`].length, fPrice]);
                }
                if ($scope.currentChartView.length === 0) {
                    $scope.currentChartView = `${name}`;
                }
                if ($scope.currentChartView === `${name}`) {
                    $scope.renderChart();
                }
            } else {
                if (fPrice !== $scope.stockData[`${name}`].price) {
                    $scope.stockData[`${name}`].color = fPrice < $scope.stockData[`${name}`].price ? "red" : "green";
                    $scope.stockData[`${name}`].delta = fPrice < $scope.stockData[`${name}`].price ? $scope.calDownValue(fPrice, $scope.stockData[`${name}`].price) : $scope.calUpValue(fPrice, $scope.stockData[`${name}`].price);
                    $scope.stockData[`${name}`].price = fPrice;
                    $scope.stockData[`${name}`].timestamp = new Date().toLocaleString();
                    if ($scope.chartData.hasOwnProperty(`${name}`)) {
                        $scope.chartData[`${name}`].push([$scope.chartData[`${name}`].length, fPrice]);
                    }
                    if ($scope.currentChartView === `${name}`) {
                        $scope.renderChart();
                    }
                }
            }

        });
    }
}
    $scope.calDownValue = function(price, prevPrice) {
        return "-" + parseFloat(((prevPrice - price) / prevPrice) * 100).toFixed(2) + "%";
    }
    $scope.calUpValue = function(price, prevPrice) {
        return "+" + parseFloat(((price - prevPrice) / prevPrice) * 100).toFixed(2) + "%";
    }
    $scope.renderChart = function() {
        google.charts.load('current', {
            'packages': ['corechart']
        });
        google.charts.setOnLoadCallback($scope.drawChart);
    };
    $scope.drawChart = function() {
        var data = new google.visualization.arrayToDataTable($scope.chartData[$scope.currentChartView]);
        var options = {
            title: 'Stock Price Trend : ' + $scope.currentChartView,
            legend: {
                position: 'bottom'
            },
            hAxis: {
                textStyle: {
                    fontSize: 0,
                    color: "#fff"
                }
            }
        };
        var chart = new google.visualization.LineChart(document.getElementById('TrendChartContainer'));
        chart.draw(data, options);
    };
}]);