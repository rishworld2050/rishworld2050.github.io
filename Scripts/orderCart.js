var orderApp=angular.module("orderCart",["ngRoute"]);
orderApp.config(function($routeProvider) {
   $routeProvider
    .when("/", {
        templateUrl : "orderBuilder.html"
    })
    .when("/orderCnf",{
           templateUrl: "orderConfirmation.html"
    })  
    .when("/finish",{
           templateUrl: "finish.html"
    })    
    .otherwise({
        templateUrl : "nothing here"
    });
});
orderApp.factory("dataFactory",function(){
var factory={};
factory.menuInfo=[
	{ 
		"type":"South Indian",
		"Item":"Idli",
		"Price":40,
		"Stock":10
	},
	{
		"type":"South Indian",
		"Item":"Vada",
		"Price":50,
		"Stock":8
	},
	{
		"type":"South Indian",
		"Item":"Plain Dosa",
		"Price":50,
		"Stock":9
	},
	{
		"type":"South Indian",
		"Item":"Masala Dosa",
		"Price":80,
		"Stock":3
	},
	{
		"type":"South Indian",
		"Item":"Onion Uttapam",
		"Price":80,
		"Stock":5
	},
	{
		"type":"South Indian",
		"Item":"Paneer Dosa",
		"Price":90,
		"Stock":10
	},
	{
		"type":"North Indian",
		"Item":"Samosa",
		"Price":20,
		"Stock":10
	},
	{
		"type":"North Indian",
		"Item":"Puri Dum Aloo",
		"Price":40,
		"Stock":8
	},
	{
		"type":"North Indian",
		"Item":"Aloo Paratha",
		"Price":50,
		"Stock":9
	},
	{
		"type":"North Indian",
		"Item":"Masala Paratha",
		"Price":60,
		"Stock":3
	},
	{
		"type":"North Indian",
		"Item":"Chana Kulcha",
		"Price":80,
		"Stock":5
	},
	{
		"type":"North Indian",
		"Item":"Chola Bathura",
		"Price":100,
		"Stock":10
	}
];
factory.getMenu=function(){
	return factory.menuInfo;
};
return factory;
});
orderApp.controller("orderBuilder",["dataFactory","$location","$scope",function(dataFactory,$location,$scope){
$scope.fName='';$scope.lName='';$scope.fAddr='';$scope.sAddr='';$scope.city='';$scope.state='';$scope.pin='';$scope.phNo='';
$scope.resetAll=function(){
$scope.menuInfo={};
$scope.menuDataRaw=dataFactory.getMenu();
	$scope.foodType=[...new Set($scope.menuDataRaw.map(item => item.type))];;
	for(var foodT in $scope.foodType){
		$scope.menuInfo[$scope.foodType[foodT].replace(/ /g,"")]=$scope.menuDataRaw.filter(function(item){
return item.type===$scope.foodType[foodT];
		});
	}
//sconsole.log($scope.foodType);
$scope.order={};
$scope.totalItem=0;
$scope.totalAmount=0;
$scope.udpateAmount=function(){
$scope.totalAmount=Object.values($scope.order).reduce(function(total,item){
	return total+(item.Price * item.selStock);
},0);
};
};
$scope.addItem=function(category,dataIdx){
	if(dataIdx!==undefined){
	var key=category+"_"+dataIdx;
}
else{
	var key=category;
	var processCategory=category.split("_");
	category=processCategory[0];
	dataIdx=processCategory[1];

}
	var removeCurrentElem=angular.element(document.querySelectorAll(".remove_"+key));
	var addCurrentElem=angular.element(document.querySelectorAll(".add_"+key));
if($scope.order[key]===undefined) {	
	$scope.order[key]={};
	$scope.order[key].Item=$scope.menuInfo[category][dataIdx].Item;
	$scope.order[key].Price=$scope.menuInfo[category][dataIdx].Price;
	$scope.menuInfo[category][dataIdx].Stock-=1;
	$scope.order[key].selStock=1;
$scope.totalItem+=1;
           removeCurrentElem.addClass("itemEnabled");
} else {
	if($scope.menuInfo[category][dataIdx].Stock>0){		
		$scope.menuInfo[category][dataIdx].Stock-=1;
		$scope.order[key].selStock+=1;		
		$scope.totalItem+=1;
	}
	if($scope.menuInfo[category][dataIdx].Stock===0){
		addCurrentElem.removeClass("itemEnabled");
	}
}
$scope.udpateAmount();
};
$scope.removeItem=function(category,dataIdx){
	if(dataIdx!==undefined){
	var key=category+"_"+dataIdx;
}
else{
	var key=category;
	var processCategory=category.split("_");
	category=processCategory[0];
	dataIdx=processCategory[1];

}
	var removeElem=angular.element(document.querySelectorAll(".remove_"+key));
	var addElem=angular.element(document.querySelectorAll(".add_"+key));
if($scope.order[key]!==undefined){
	if($scope.order[key].selStock>0){
		$scope.order[key].selStock-=1;
		$scope.menuInfo[category][dataIdx].Stock+=1;
          addElem.addClass("itemEnabled");
          $scope.totalItem-=1;
	}
	if($scope.order[key].selStock===0){
		removeElem.removeClass("itemEnabled");
		delete $scope.order[key];
	}
}
$scope.udpateAmount();
};
$scope.validateAndRedirect=function(path,isReset){
	if(isReset){
		$scope.resetAll();
	}
	if(path==='/finish'){
$scope.orderId=Math.random(36).substring(7);
	}
	$location.path(path);
};
$scope.resetAll();
}]);