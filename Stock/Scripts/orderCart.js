var stkApp=angular.module("stockApp",['ngWebSocket']);

  stkApp.factory('MyData',["$websocket", function($websocket) {
      // Open a WebSocket connection
      var dataStream = $websocket('ws://stocks.mnet.website');

      var collection = [];

      dataStream.onMessage(function(message) {
      	collection[0]=JSON.parse(message.data);
      });

      var methods = {
        collection: collection,
        get: function() {
          dataStream.send(JSON.stringify({ action: 'get' }));
        }
      };

      return methods;
    }]);
stkApp.controller('StockController', ["MyData","$scope",function (MyData, $scope) {
     
     	$scope.stockData={};
     $scope.test=MyData;
    setInterval(function(){
   // console.log($scope.test.collection);
   $scope.processData(angular.copy($scope.test.collection[0]));
 },3000);
 
 $scope.processData=function(dataArray){
 	dataArray.forEach(([name,price]) => {

 		if(!$scope.stockData.hasOwnProperty(`${name}`)){

	$scope.stockData[`${name}`]={
               "name":`${name}`,
               "price":parseFloat(`${price}`),
               "color":"white",
               "delta":"0",
               "timestamp":new Date().toLocaleString()
	};
}

else{
if(parseFloat(`${price}`)!==$scope.stockData[`${name}`].price){
	$scope.stockData[`${name}`].color=parseFloat(`${price}`)<$scope.stockData[`${name}`].price? "red":"green";
	$scope.stockData[`${name}`].delta=parseFloat(`${price}`)<$scope.stockData[`${name}`].price? $scope.calDownValue(parseFloat(`${price}`),$scope.stockData[`${name}`].price):$scope.calUpValue(parseFloat(`${price}`),$scope.stockData[`${name}`].price);
$scope.stockData[`${name}`].price=parseFloat(`${price}`);
$scope.stockData[`${name}`].timestamp=new Date().toLocaleString();
}
}

});
 	console.log($scope.stockData);
 	}
 	$scope.calDownValue=function(price,prevPrice){
       return "-"+parseFloat(((prevPrice-price)/prevPrice)*100).toFixed(2)+"%";
        	}
$scope.calUpValue=function(price,prevPrice){
       return "+"+parseFloat(((price-prevPrice)/prevPrice)*100).toFixed(2)+"%";
 	}

 
}

    ]);