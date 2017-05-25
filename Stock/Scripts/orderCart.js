var stkApp=angular.module("stockApp",['ngWebSocket']);

  stkApp.factory('MyData',["$websocket", function($websocket) {
      // Open a WebSocket connection
      var dataStream = $websocket('ws://stocks.mnet.website');

      var collection = [];

      dataStream.onMessage(function(message) {
        collection.push(JSON.parse(message.data));
        console.log(JSON.parse(message.data));
      });

      var methods = {
        collection: collection,
        get: function() {
          dataStream.send(JSON.stringify({ action: 'get' }));
        }
      };

      return methods;
    }]);
stkApp.controller('SomeController', ["MyData","$scope",function ($scope, MyData) {
      $scope.MyData = MyData;
    }]);