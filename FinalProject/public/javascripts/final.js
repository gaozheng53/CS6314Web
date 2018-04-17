var app = angular.module('FinalProject', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/', {
		templateUrl: 'partials/home.html',
		controller: 'HomeCtrl'
	})
	.when('/sign-up', {
        templateUrl: 'partials/sign-up.html',
    	controller: 'AddAccountCtrl'
    })
    .when('/manage-menu', {
        templateUrl: 'partials/manage-menu.html',
        controller: 'ManageMenuCtrl'
    })
    .when('/usercenter', {
        templateUrl: 'partials/usercenter.html'
    })
    .when('/new-dish', {
        templateUrl: 'partials/new-dish.html',
    	controller: 'AddDishCtrl'
    })
    .when('/choose-dish', {
        templateUrl: 'partials/choose-dish.html',
        controller: 'ChooseDishCtrl'
    })
    .when('/dish/:id', {
        templateUrl: 'partials/new-dish.html',
        controller: 'EditDishCtrl'
    })
    .when('/dish/delete/:id', {
        templateUrl: 'partials/delete-dish.html',
        controller: 'DeleteDishCtrl'
    })
    .when('/cart', {
        templateUrl: 'partials/cart.html',
    	controller: 'CartCtrl'
    })
    .when('/cart/delete/:id', {
        templateUrl: 'partials/delete-cart.html',
        controller: 'DeleteCartCtrl'
    })
    .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
    })
	.otherwise({
		redirectTo: '/'
	});
}]);

app.controller('HomeCtrl', ['$scope', '$resource','$location',
	function($scope, $resource, $location){
        $scope.jump = function() {
                $location.path('login');
        }
		var Users = $resource('/api/user');
		Users.query(function(user){
			$scope.user = user;
		});
		var Dishs = $resource('/api/dish');
		Dishs.query(function(dish){
			$scope.dish = dish;
		});
	}]);


app.controller('AddAccountCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){
            if(typeof $scope.user==="undefined"){
                console.log("user undefined");
                $scope.user = {};
                return;
            }
            if(!($scope.user.hasOwnProperty('username')&&$scope.user.hasOwnProperty('password'))){
                console.log("properties undefined");
                $scope.user = {};
                return;
            }

            console.log("Validation passed");

            var Users = $resource('/api/user');
            Users.save($scope.user, function(){
                $location.path('/');
            });
            $scope.user = {};
            // alert($scope.errorinfo);
            // console.log($scope.errorinfo);
        };
    }]);

app.controller('AddDishCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.save = function(){
            var Dishs = $resource('/api/dish');
            Dishs.save($scope.dish, function(){
                $location.path('/');
            });
        };
    }]);

app.controller('ChooseDishCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
    	var Dishs = $resource('/api/dish');
    	var Cart = $resource('/api/cart');
		Dishs.query(function(dish){
			$scope.dish = dish;
		});
		
        $scope.save = function(){
           
            Cart.save($scope.cart, function(){
                $location.path('choose-dish');
            });
        };
 
    }]);


app.controller('EditDishCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){   
        var Dish = $resource('/api/dish/:id', { id: '@_id' }, {
            update: { method: 'PUT' }
        });

        Dish.get({ id: $routeParams.id }, function(dish){
            $scope.dish = dish;
        });

        $scope.save = function(){
            Dish.update($scope.dish, function(){
                $location.path('manage-menu');
            });
        }
    }]);


app.controller('DeleteDishCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Dish = $resource('/api/dish/:id');

        Dish.get({ id: $routeParams.id }, function(dish){
            $scope.dish = dish;
        })

        $scope.delete = function(){
            Dish.delete({ id: $routeParams.id }, function(dish){
                $location.path('manage-menu');
            });
        }
    }]);


app.controller('CartCtrl', ['$scope', '$resource', 
    function($scope, $resource){
        var Cart = $resource('/api/cart');
        Cart.query(function(cart){
            $scope.cart = cart;
        });
    }]);


app.controller('DeleteCartCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function($scope, $resource, $location, $routeParams){
        var Cart = $resource('/api/cart/:id');

        Cart.get({ id: $routeParams.id }, function(cart){
            $scope.cart = cart;
        })

        $scope.delete = function(){
            Cart.delete({ id: $routeParams.id }, function(cart){
                $location.path('cart');
            });
        }
    }]);



app.controller('LoginCtrl', ['$scope', '$resource', '$location',
    function($scope, $resource, $location){
        $scope.submit = function() {
            $location.path('usercenter');
        };
        $scope.signup = function() {
            $location.path('sign-up');
        };
    }]);

app.controller('ManageMenuCtrl', ['$scope', '$resource', 
    function($scope, $resource){
        var Dishs = $resource('/api/dish');
        Dishs.query(function(dish){
            $scope.dish = dish;
        });
    }]);

