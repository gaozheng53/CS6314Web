var app = angular.module('FinalProject', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
    })
    .when('/detail', {
        templateUrl: 'partials/detail.html',
        controller: 'DetailCtrl'
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
    .when('/cart/:id', {
        templateUrl: 'partials/temp.html',
        controller: 'AddCartCtrl'
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

app.controller('HomeCtrl', ['$scope', '$resource','$location', '$rootScope', //controller 改
    function($scope, $resource, $location, $rootScope){
        $scope.jump = function() {
                $location.path('detail');
        }
        $rootScope.username = window.localStorage.getItem("username", $rootScope.username);
        $rootScope.status = window.localStorage.getItem("status", $rootScope.status);
        console.log('$rootScope.status:' ,$rootScope.status);
        
        if ($rootScope.status == undefined || $rootScope.status == null || $rootScope.status == 0) {  
                console.log('guset!');
        }else if($rootScope.status == 1){
            console.log('normal user, ', $rootScope.username);
        }else if($rootScope.status == 2){
            console.log('admin user, ', $rootScope.username);
        }else{
            console.log('wrong!');
        }
        
    }]);

app.controller('DetailCtrl', ['$scope', '$resource','$location','$rootScope','$window','$http',
    function($scope, $resource, $location,$rootScope,$window,$http){
        $scope.addDish = function(dish){
            var items = $rootScope.cart['items'];
            if(items.hasOwnProperty(dish['_id'])){
                var item = items[dish['_id']];
                item['qty'] = item['qty']+1;
            }else{
                dish['qty'] = 1;
                items[dish['_id']] = dish;
            }
            // console.log($rootScope.cart);

            var parameter = JSON.stringify($rootScope.cart);
            $http.post('/api/cart/'+$rootScope.cart['_id'], parameter).
                success(function(data, status, headers, config) {
            // console.log(data);
            }).error(function(data, status, headers, config) {
       
            });
        }
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
//      find out specific user's cart object
        var Cart = $resource('/api/cart/:id');
        Cart.query(function(cart){
            for(var i=0; i<cart.length;i++){
                if(cart[i].username=="Jason"){   // 写死了个username测试
                    $rootScope.cart = cart[i];
                    // window.localStorage.setItem("Cart", $rootScope.cart);                    break;
                }
            }           
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
            $scope.user['password'] = md5($scope.user['password']);
            Users.save($scope.user, function(){
                $location.path('/');
            });
            $scope.user = {};
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


app.controller('CartCtrl', ['$scope', '$resource', '$rootScope',
    function($scope, $resource,$rootScope){
        var Cart = $resource('/api/cart');
        Cart.query(function(cart){
            $scope.cart = $rootScope.cart.items;
        });
        // console.log($rootScope.cart.items);
        
        $scope.getTotal = function(){
            var total = 0;
            // console.log(total);
            for(var item in $rootScope.cart.items){
                console.log(item);
                break;
                // total += (item.price * item.qty);
            }
        // for(var i = 0; i < $rootScope.cart.length; i++){
        //     var product = $rootScope.cart[i];
        //     total += (product.price * product.qty);
        // }
            return total;

        }
        
    }]);


app.controller('AddCartCtrl', ['$scope', '$resource', '$routeParams','$rootScope','$window',
    function($scope, $resource, $routeParams,$rootScope,$window){
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


app.controller('LoginCtrl', ['$scope', '$resource', '$location', '$rootScope',
    function($scope, $resource, $location, $rootScope){
        $scope.submit = function() {
            var Users = $resource('/api/login');
            //$scope.user['password'] = md5($scope.user['password']);
            console.log($scope.user);
            Users.save($scope.user, function(res){
               if(res['result'] === 1){

                 $location.path('detail'); 
                 $rootScope.username = $scope.user['username'];
                 $rootScope.status = 1;
                 window.localStorage.setItem("username", $rootScope.username);
                 window.localStorage.setItem("status", $rootScope.status);
                 
               }else if (res['result'] === 2) {

                 $location.path('detail'); 
                 $rootScope.username = $scope.user['username'];
                 $rootScope.status = 2;
                 window.localStorage.setItem("username", $rootScope.username);
                 window.localStorage.setItem("status", $rootScope.status);

               }else{
                    console.log("failed",$rootScope.username);
                }
            });  
        };
        $scope.logout = function() {
            delete $rootScope['username'];
            window.localStorage.setItem("username", $rootScope.username);
            window.localStorage.setItem("status", 0); 
            $location.path('/')
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

