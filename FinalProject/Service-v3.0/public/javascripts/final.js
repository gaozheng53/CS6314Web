var app = angular.module('FinalProject', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
    .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'Home'
        })
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        })
        .when('/signup', {
            templateUrl: 'partials/signup.html',
            controller:'AddAccountCtrl'
        })
        .when('/details', {
            templateUrl: 'partials/details.html',
            controller: 'Details'
        })
        .when('/cart', {
            templateUrl: 'partials/cart.html',
            controller: 'Cart'
        })
        .when('/ordersummary', {
            templateUrl: 'partials/OrderSummary.html',
            controller: 'OrderSummary'
        })
        .when('/paysuccess', {
            templateUrl: 'partials/PaySuccess.html'
        })
        .when('/editinfo', {
            templateUrl: 'partials/EditInfo.html',
            controller: 'EditInfo'
        })
        .when('/editdish/:id', {
            templateUrl: 'partials/EditDish.html',
            controller: 'EditDish'
        })
        .when('/editpassword', {
            templateUrl: 'partials/EditPassword.html',
            controller: 'EditPassword'
        })
        .when('/orderhistory', {
            templateUrl: 'partials/OrderHistory.html',
            controller: 'OrderHistory'
        })
        .when('/addnew', {
            templateUrl: 'partials/adddish.html',
            controller: 'AddDishCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('Home',['$scope','$location','$resource','$window',
    function($scope,$location,$resource,$window){
        console.log($window.sessionStorage.getItem('role'));
        if ( $window.sessionStorage.getItem('role') === null) 
        {
            $window.sessionStorage.setItem('role',0);
        }

        $scope.user = $window.sessionStorage.getItem('username');
        $scope.auth = $window.sessionStorage.getItem('role');

        $scope.jump = function(path) {
            if ($scope.auth == 1 || $scope.auth == 2) {
                $window.location.href = path;
            }
            else if ($scope.auth == 0) {
                alert("Please log in before you ordering !");
                $window.location.href = "/#/login";
            }          
        }
        $scope.logout = function(){
            var url = $location.url();
            console.log(url);
            if (url!="/") {
               $window.location.href = "#/";
            }
            $window.sessionStorage.setItem('role',0);
            $window.sessionStorage.setItem('username',null);
            $window.location.reload();
        }
    }]);

app.controller('Cart',['$scope','$location','$resource','$window','CartService',
    function($scope,$location,$resource,$window,CartService){
        console.log($window.sessionStorage.getItem('role'));
        $scope.user = $window.sessionStorage.getItem('username');
        $scope.auth = $window.sessionStorage.getItem('role');
        CartService.thisCartItem($scope.user).then(function (result) {
            console.log('当前购物车',$scope.cart);
            $scope.cart = result;
        }).then(function () {
            $("#totalprice").text(CartService.totalPrice($scope.cart));
        });

        $scope.deletedish = function (dish, username) {
            // console.log("dish : ",dish);
            // console.log("username : ",username);
            CartService.deletedish(dish, username);
            $window.location.reload();   // reload this page
        };
        $scope.confirmation = function () {
            // console.log("$scope.cart : ",$scope.cart);
            // console.log("username : ",username);
            // console.log("totalprice : ",CartService.totalPrice($scope.cart));
            $location.path('ordersummary');
        };
        $scope.incr = function (dish, username) {
            console.log("$scope.cart : ", $scope.cart);
            dish.qty += 1;
            CartService.addQuantity(dish, username);
            $("#totalprice").text(CartService.totalPrice($scope.cart));
        };
        $scope.decr = function (dish, username) {
            if (dish.qty > 1)
                dish.qty -= 1;
            CartService.DecrQuantity(dish, username);
            $("#totalprice").text(CartService.totalPrice($scope.cart));
        };
}]);

app.controller('Details',['$scope','$location','$resource','$window','CartService','MenuService',
    function($scope,$location,$resource,$window,CartService,MenuService){
        console.log($window.sessionStorage.getItem('role'));
        $scope.user = $window.sessionStorage.getItem('username');
        $scope.auth = $window.sessionStorage.getItem('role');

        //checkbox
        $scope.category = [{
            id:1,
            tag:'Appetizer'
        },{
            id:2,
            tag:'Entree'
        },{
            id:3,
            tag:'Soup'
        },{
            id:4,
            tag:'Desserts'
        },{
            id:5,
            tag:'Combo'
        }];

        var selectedtag = [];

        $scope.updateSelection = function($event){
            var catebox = $event.target;
            var action = (catebox.checked?'add':'remove');
            updateSelected(action,catebox.name);
        }
        var updateSelected = function(action,name){
            if(action == 'add' && selectedtag.indexOf(name) == -1){
                selectedtag.push(name);
            }
            if(action == 'remove' && selectedtag.indexOf(name) != -1){
                var idx = selectedtag.indexOf(name);
                selectedtag.splice(idx,1);
            }
        }


        //以下是显示
        var Dish = $resource('/api/dish');
        Dish.query(function(dish){
            $scope.dish = dish;
        });
        $scope.func = function(e){
            if (selectedtag.length < 1) {
                return (e.class == 'Appetizer'||
                    e.class == 'Entree'||
                    e.class == 'Soup'||
                    e.class == 'Desserts'||
                    e.class == 'Combo')
            }
            for (var i = 0; i < selectedtag.length; i++) {
                if(e.class == selectedtag[i]){
                    console.log("过滤掉了：",selectedtag[i]);
                    return e.class == selectedtag[i];
                }
            }
        }

        //以下是加入购物车
        $scope.addtocart = function(dish,username){
            console.log(dish);
            console.log(username);
            CartService.updatecart(dish,username);
        };

        //以下是退出
        $scope.logout = function(){
            var url = $location.url();
            console.log(url);
            if (url!="/") {
               $window.location.href = "#/";
            }
            $window.sessionStorage.setItem('role',0);
            $window.sessionStorage.setItem('username',null);
            $window.location.reload();
        }

}]);

//加新菜的controller--------------------------开始--------------------------------------

app.controller('AddDishCtrl', function($scope, fileReader, $window, $resource, $location){
    $scope.user = $window.sessionStorage.getItem('username');
    $scope.auth = $window.sessionStorage.getItem('role');
    console.log($scope.file);
    $window.localStorage.setItem('dishImgUrl',undefined);
    $scope.getFile = function () {
        console.log($scope.file.name);
        if ($window.localStorage.getItem('dishImgUrl')==null||
            $window.localStorage.getItem('dishImgUrl')==undefined) {
            $window.localStorage.setItem('dishImgUrl',$scope.file.name);
        }else{
            $window.localStorage.setItem('dishImgUrl',null);
            $window.localStorage.setItem('dishImgUrl',$scope.file.name);
        }        
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
          $scope.imageSrc = result;
      });
    };
    //console.log('存到本地了吗',$window.localStorage.getItem('dishImgUrl'));
    $scope.category = ["Appetizer", "Entree", "Soup", "Desserts", "Combo"];
    console.log($scope.category);
    $scope.newdish = {
        name:"",
        class:"",
        picture:"",
        price:0,
        stock:0,
        description:""
    };
    $scope.save = function(newdish){
        console.log('存到本地了吗',$window.localStorage.getItem('dishImgUrl'));
        newdish.picture = "../images/"+$window.localStorage.getItem('dishImgUrl');
        console.log('获得的新菜品信息',newdish);
        var Newdish = $resource('/api/dish');
        Newdish.save(newdish,function(){
            $location.path('details');
        });
    }

    $scope.logout = function(){
            var url = $location.url();
            console.log(url);
            if (url!="/") {
               $window.location.href = "#/";
            }
            $window.sessionStorage.setItem('role',0);
            $window.sessionStorage.setItem('username',null);
            $window.location.reload();
        }

});

app.directive('fileModel', ['$parse', function ($parse) {
                return {
                    restrict: 'A',
                    link: function(scope, element, attrs, ngModel) {
                        var model = $parse(attrs.fileModel);
                        var modelSetter = model.assign;
                        element.bind('change', function(event){
                            scope.$apply(function(){
                                modelSetter(scope, element[0].files[0]);
                            });
                            //附件预览
                                 scope.file = (event.srcElement || event.target).files[0];
                            scope.getFile();
                        });
                    }
                };
            }]);

app.factory('fileReader', ["$q", "$log", function($q, $log){
                var onLoad = function(reader, deferred, scope) {
                    return function () {
                        scope.$apply(function () {
                            deferred.resolve(reader.result);
                        });
                    };
                };
         
                var onError = function (reader, deferred, scope) {
                    return function () {
                        scope.$apply(function () {
                            deferred.reject(reader.result);
                        });
                    };
                };
         
                var getReader = function(deferred, scope) {
                    var reader = new FileReader();
                    reader.onload = onLoad(reader, deferred, scope);
                    reader.onerror = onError(reader, deferred, scope);
                    return reader;
                };
         
                var readAsDataURL = function (file, scope) {
                    var deferred = $q.defer();
                    var reader = getReader(deferred, scope);         
                    reader.readAsDataURL(file);
                    return deferred.promise;
                };
         
                return {
                    readAsDataUrl: readAsDataURL  
                };
            }]);

//加新菜的controller--------------------------结束--------------------------------------

//修改个人信息的controller-------------------------开始-------------------------------
app.controller('EditInfo', ['$scope', '$location', '$resource', '$window',
    function ($scope, $location, $resource, $window) {
        $scope.user = $window.sessionStorage.getItem('username');
        $scope.auth = $window.sessionStorage.getItem('role');
        var User = $resource('/api/user/:username', {username: '@username'}, {
            update: {method: 'PUT'}
        });
        User.get({username: $scope.user}, function (user) {
            $scope.userobj = user;
        });
        $scope.save = function () {
            User.update($scope.userobj, function () {
                console.log("Update successfully!");
                $location.path('details');
            });
        }
        $scope.logout = function(){
            var url = $location.url();
            console.log(url);
            if (url!="/") {
               $window.location.href = "#/";
            }
            $window.sessionStorage.setItem('role',0);
            $window.sessionStorage.setItem('username',null);
            $window.location.reload();
        }
    }]);


//以下为编辑菜品信息---------------------------开始--------------------------------
app.controller('EditDish', ['$scope', '$location', '$resource', '$window', '$routeParams','fileReader',
    function ($scope, $location, $resource, $window, $routeParams, fileReader) {
        $scope.user = $window.sessionStorage.getItem('username');
        $scope.auth = $window.sessionStorage.getItem('role');
        $scope.category = ["Appetizer", "Entree", "Soup", "Desserts", "Combo"];
        $window.localStorage.setItem('dishImgUrl',undefined);
        $scope.getFile = function () {
            console.log($scope.file.name);
            if ($window.localStorage.getItem('dishImgUrl')==null||
                $window.localStorage.getItem('dishImgUrl')==undefined) {
                $window.localStorage.setItem('dishImgUrl',$scope.file.name);
            }else{
                $window.localStorage.setItem('dishImgUrl',null);
                $window.localStorage.setItem('dishImgUrl',$scope.file.name);
            }        
            fileReader.readAsDataUrl($scope.file, $scope).then(function(result) {
                $scope.imageSrc = result;
            });
        };


        var Dish = $resource('/api/dish/:id', {id: '@_id'}, {
            update: {method: 'PUT'}
        });
        Dish.get({id: $routeParams.id}, function (dish) {
            $scope.dish = dish;
        });
        $scope.save = function (editdish) {
            console.log('原来的图片地址',editdish.picture);
            console.log('存到本地了吗',$window.localStorage.getItem('dishImgUrl'));
            if ($window.localStorage.getItem('dishImgUrl')!="undefined") {
                editdish.picture = "../images/"+$window.localStorage.getItem('dishImgUrl');
            }    
            console.log('获得的新菜品信息',editdish);
            Dish.update(editdish, function () {
                console.log("Update successfully!");
                $location.path('details');
            });
        }
        $scope.logout = function(){
            var url = $location.url();
            console.log(url);
            if (url!="/") {
               $window.location.href = "#/";
            }
            $window.sessionStorage.setItem('role',0);
            $window.sessionStorage.setItem('username',null);
            $window.location.reload();
        }


    }]);
//编辑菜品信息---------------------------结束--------------------------------

app.controller('OrderHistory', ['$scope', '$location', '$resource', '$window', 'OrderService',
    function ($scope, $location, $resource, $window, OrderService) {
        $scope.user = $window.sessionStorage.getItem('username');
        $scope.auth = $window.sessionStorage.getItem('role');
        $scope.orderhistory = OrderService.showOrderHistory($scope.user);
        $scope.item = $scope.orderhistory.items;
        // console.log("$scope.orderhistory = ",$scope.orderhistory);
        $scope.logout = function(){
            var url = $location.url();
            console.log(url);
            if (url!="/") {
               $window.location.href = "#/";
            }
            $window.sessionStorage.setItem('role',0);
            $window.sessionStorage.setItem('username',null);
            $window.location.reload();
        }
    }]);

app.controller('EditPassword', ['$scope', '$location', '$resource', '$window', '$routeParams', 'AuthService',
    function ($scope, $location, $resource, $window, $routeParams, AuthService) {
        $scope.user = $window.sessionStorage.getItem('username');
        $scope.auth = $window.sessionStorage.getItem('role');
        $scope.save = function () {
            AuthService.matchPassword($scope.user, $scope.originalpw).then(function (result) {
                if (result) {
                    if ($scope.newpw == $scope.confirmnewpw) {
                        AuthService.updatePassword($scope.user, $scope.newpw);
                        $location.path('details');
                    } else {
                        alert("Please enter the same password twice！");
                    }
                } else {
                    alert("Please enter correct old password!");
                }
            });

        }
        $scope.logout = function(){
            var url = $location.url();
            console.log(url);
            if (url!="/") {
               $window.location.href = "#/";
            }
            $window.sessionStorage.setItem('role',0);
            $window.sessionStorage.setItem('username',null);
            $window.location.reload();
        }

    }]);

app.controller('AddAccountCtrl', ['$scope', '$resource', '$location','$window','SignService',
    function($scope, $resource, $location,$window,SignService){
        console.log($scope.unique);
        $scope.save = function(newuser){
            if ($scope.signup == undefined || 
                $scope.signup.password == undefined ||
                $scope.signup.username == undefined ||
                $scope.signup.email == undefined) {
                console.log("请填完信息");
                console.log($scope.signup);
            } else {
                console.log($scope.signup);
                console.log('New',newuser);
                SignService.signup(newuser).then(function(state){
                    console.log('传回来的',state);
                    $scope.unique = !state.message;
                    if (state.message) {
                        $window.sessionStorage.setItem('username',newuser.username);
                        $window.sessionStorage.setItem('role',state.result);
                        $location.path('details');
                    }
                });
            }  
        };
    }]);

app.controller('OrderSummary', ['$scope', '$location', '$resource', '$window', 'CartService', 'OrderService',
    function ($scope, $location, $resource, $window, CartService, OrderService) {
        // console.log($window.sessionStorage.getItem('role'));
        $scope.user = $window.sessionStorage.getItem('username');
        $scope.auth = $window.sessionStorage.getItem('role');
        CartService.thisCartItem($scope.user).then(function (result) {
            $scope.cart = result;
            $scope.totalprice = CartService.totalPrice($scope.cart);
        });
        $scope.save = function () {   // put order
            console.log("username:", $scope.user);
            console.log("cart : ", $scope.cart);
            console.log("total price : ", $scope.totalprice);
            var myDate = new Date();
            // console.log("Current time : ", myDate.toLocaleDateString() + " " + myDate.toLocaleTimeString());
            // var valid = OrderService.validateOrder($scope.cart);
            OrderService.validateAndPlaceOrder($scope.user,$scope.cart,$scope.totalprice, myDate.toLocaleDateString() + " " + myDate.toLocaleTimeString());  //////////////把validate和placeorder写在一起！！！
            $location.path('details');
        };
        $scope.logout = function(){
            var url = $location.url();
            console.log(url);
            if (url!="/") {
               $window.location.href = "#/";
            }
            $window.sessionStorage.setItem('role',0);
            $window.sessionStorage.setItem('username',null);
            $window.location.reload();
        }
    }]);

app.factory('SignService',function($http,$window,$q){
    var SignService = {};
    SignService.signup = function (newuser) {
        newuser.password = md5(newuser.password);
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.post("/api/user",newuser)
        .then(function successCallback(response) {
            deferred.resolve(response.data);
            console.log('service', response.data['result']);
            console.log('service', response.data['message']);
        }, function errorCallback(response) {
            deferred.reject();
            console.log('error');
        });
        return promise;
    };
    return SignService;
});

app.controller('LoginCtrl', ['$scope', '$resource', '$location', '$rootScope',
                            '$window','AuthService',
    function($scope, $resource, $location, $rootScope, $window,AuthService){
        $scope.credentials = {
            username : '',
            password : ''
        };  

        $scope.login = function(credentials) {

            AuthService.login(credentials).then(function(role){
                console.log('登录后身份',role);
                if (role===1||role===2) {
                    $window.sessionStorage.setItem('username',credentials.username);
                    $window.sessionStorage.setItem('role',role);
                    $location.path('details');
                } else {
                    $window.sessionStorage.setItem('username',null);
                    $window.sessionStorage.setItem('role',role);
                    $location.path('/');
                }
            });
        };
        $scope.jump = function(path) {
            $window.location.href = path;        
        }
}]);

app.factory('MenuService',function($http,$window,$q){
    var MenuService = {};
    MenuService.getAllMenu = function () {
        var allmenu = [];
        var menudeferred = $q.defer();
        var menupromise = menudeferred.promise;
        $http.get("/api/dish")
        .then(function successCallback(response) {
            for (var i = 0; i < response.data.length; i++) {
                allmenu.push(response.data[i]);
            }
            menudeferred.resolve(allmenu);
            //console.log('menu', response.data);
            console.log('allmenu', allmenu);
        }, function errorCallback(response) {
            menudeferred.reject();
            console.log('error');
        });
        return menupromise;
    };
    return MenuService;
});

app.factory('AuthService',function($http,$window,$q){
	var AuthService = {};
	AuthService.login = function (credentials) {
		credentials.password = md5(credentials.password);
        var deferred = $q.defer();
        var promise = deferred.promise;
		$http.post("/api/login",credentials)
		.then(function successCallback(response) {
            deferred.resolve(response.data['result']);
            console.log('service', response.data['result']);
    	}, function errorCallback(response) {
            deferred.reject();
        	console.log('error');
    	});
        return promise;
	};

    //////////////////////
    AuthService.matchPassword = function (username, inputOldPw) {
        inputOldPw = md5(inputOldPw);   // convert to md5 format
        var deferred = $q.defer();
        var promise = deferred.promise;
        $http.get("/api/user")
            .then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].username == username) {
                        if (response.data[i].password == inputOldPw) {
                            // console.log("Match successfully!");
                            deferred.resolve(true);
                        }
                    }

                }
                // console.log("Match error!");
                deferred.resolve(false);
            }, function errorCallback(response) {
                deferred.reject();
                console.log('error');
            });
        return promise;
    };

    //////////
    AuthService.updatePassword = function (username, newpw) {
        $http.get("/api/user")
        .then(function successCallback(response) {
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].username == username) {
                    response.data[i].password = md5(newpw);
                    var user = response.data[i];
                }

            }
            var parameter = JSON.stringify(user);
            console.log("parameter = ", parameter);
            $http.post('/api/user/' + user['_id'], parameter)
            .success(function (data, status, headers, congig) {
                console.log('成功更新密码');
            })
            .error(function (data, status, headers, congig) {
                console.log('未成功更新');
            });
        }, function errorCallback(response) {
            console.log('error');
        });
    };

	return AuthService;
});

app.factory('CartService',function($http,$window,$q){
    var CartService = {};

    // add dish
    CartService.updatecart = function (dish, username) {
        $http.get("/api/cart")
            .then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].username == username) {
                        console.log(response.data[i]);
                        if (response.data[i].items.hasOwnProperty(dish['_id'])) {
                            var item = response.data[i].items[dish['_id']];
                            item['qty'] += 1;
                        } else {
                            dish['qty'] = 1;
                            response.data[i].items[dish['_id']] = dish;
                        }
                        var user = response.data[i];
                    }
                }
                console.log(user);
                var parameter = JSON.stringify(user);
                $http.post('/api/cart/' + user['_id'], parameter)
                    .success(function (data, status, headers, congig) {
                        console.log('成功加入');
                    })
                    .error(function (data, status, headers, congig) {
                        console.log('未成功加入');
                    });
                //console.log(response);
            }, function errorCallback(response) {
                console.log('error');
            });
    };

    // delete dish
    CartService.deletedish = function (dish, username) {
        $http.get("/api/cart")
            .then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].username == username) {
                        if (response.data[i].items.hasOwnProperty(dish['_id'])) {
                            var item = response.data[i].items[dish['_id']];
                            delete response.data[i].items[dish['_id']];
                            console.log(response.data[i].items);
                        } else {
                            console.log("No such dish!");
                        }
                        var user = response.data[i];
                    }
                }
                // console.log(user);
                var parameter = JSON.stringify(user);
                $http.post('/api/cart/' + user['_id'], parameter)
                    .success(function (data, status, headers, congig) {
                        console.log('成功删除');
                    })
                    .error(function (data, status, headers, congig) {
                        console.log('未成功删除');
                    });
                //console.log(response);
            }, function errorCallback(response) {
                console.log('error');
            });
    };

    // Input:username
    // Output:clear its cart's items
    CartService.clearCart = function (username) {
        var cartiddefer = $q.defer();
        var cartidpromise = cartiddefer.promise;
        $http.get("/api/cart").then(function successCallback(response) {
            // console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].username == username) {
                    // console.log("return is : ", response.data[i]);
                    response.data[i].items = {};
                    cartiddefer.resolve(response.data[i]);
                    var user = response.data[i];
                }
            }
            console.log(user);
            var parameter = JSON.stringify(user);
            $http.post('/api/cart/' + user['_id'], parameter)
                .success(function (data, status, headers, congig) {
                    console.log('成功');
                })
                .error(function (data, status, headers, congig) {
                    console.log('未成功');
                });
        }, function errorCallback(response) {
            cartiddefer.reject();
            console.log('error');
        });
        return cartidpromise;
    };

    // Input:username
    // Output:its cart's items
    CartService.thisCartItem = function (username) {
        var cartiddefer = $q.defer();
        var cartidpromise = cartiddefer.promise;
        $http.get("/api/cart").then(function successCallback(response) {
            console.log(response.data);
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].username == username) {
                    // console.log("return is : ", response.data[i].items);
                    cartiddefer.resolve(response.data[i].items);
                }
            }
        }, function errorCallback(response) {
            cartiddefer.reject();
            console.log('error');
        });
        return cartidpromise;
    };

    // Input: cart object's "items" content
    // Output:totalprice
    CartService.totalPrice = function (items) {
        var totalprice = 0;
        for (var item in items) {
            totalprice += items[item].price * items[item].qty;
        }
        return totalprice;
    };

    // Add one quntity of user's specific dish
    CartService.addQuantity = function (dish, username) {
        $http.get("/api/cart")
            .then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].username == username) {
                        if (response.data[i].items.hasOwnProperty(dish['_id'])) {
                            var item = response.data[i].items[dish['_id']];
                            item['qty'] += 1;
                        }
                        var user = response.data[i];
                    }
                }
                var parameter = JSON.stringify(user);
                $http.post('/api/cart/' + user['_id'], parameter)
                    .success(function (data, status, headers, congig) {
                        console.log('成功');
                    })
                    .error(function (data, status, headers, congig) {
                        console.log('未成功');
                    });
                //console.log(response);
            }, function errorCallback(response) {
                console.log('error');
            });
    };

    // Decrease one quntity of user's specific dish
    CartService.DecrQuantity = function (dish, username) {
        $http.get("/api/cart")
            .then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].username == username) {
                        if (response.data[i].items.hasOwnProperty(dish['_id'])) {
                            var item = response.data[i].items[dish['_id']];
                            if (item['qty'] > 1)
                                item['qty'] -= 1;
                        }
                        var user = response.data[i];
                    }
                }
                var parameter = JSON.stringify(user);
                $http.post('/api/cart/' + user['_id'], parameter)
                    .success(function (data, status, headers, congig) {
                        console.log('成功');
                    })
                    .error(function (data, status, headers, congig) {
                        console.log('未成功');
                    });
                //console.log(response);
            }, function errorCallback(response) {
                console.log('error');
            });
    };


    return CartService;
});

app.factory('OrderService', function ($http, $location, $window, $q, CartService) {
    var OrderService = {};

    // Input: username, its items,totalprice,time
    OrderService.addToOrder = function (username, items, totalprice, currenttime) {
        $http.get("/api/order")
            .then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].username == username) {
                        var order = {};   //要添加的一个order
                        order.items = items;
                        order.time = currenttime;
                        order.totalprice = totalprice;
                        console.log("order = ", order);
                        response.data[i].orders.push(order);   // 添加
                        console.log("添加后：response.data[i].orders=", response.data[i].orders);  // 被更新的数组对象

                        var user = response.data[i];
                        console.log("user : ", user);
                    }
                }
                var parameter = JSON.stringify(user);
                $http.post('/api/order/' + user['_id'], parameter)
                    .success(function (data, status, headers, congig) {
                        console.log('成功');
                    })
                    .error(function (data, status, headers, congig) {
                        console.log('未成功');
                    });
                //console.log(response);
            }, function errorCallback(response) {
                console.log('error');
            });
    };

    // return: this user's order history
    OrderService.showOrderHistory = function (username) {
        var res = [];
        $http.get("/api/order")
            .then(function successCallback(response) {
                for (var i = 0; i < response.data.length; i++) {
                    if (response.data[i].username == username) {
                        // console.log("response.data[i].orders : ", response.data[i].orders);
                        for (var j = 0; j < response.data[i].orders.length; j++) {
                            res.push(response.data[i].orders[j]);
                        }

                    }
                }
            }, function errorCallback(response) {
                console.log('error');
            });
        // console.log("return order history object is : ",res);
        return res;
    };

    // if every item in the cart is enough,place order and clean the cart
    OrderService.validateAndPlaceOrder = function (username, cart, totalprice, currenttime) {
        $http.get("/api/dish")
            .then(function successCallback(response) {
                // console.log(response.data);
                var res = [];   // 库存不够的菜品列表
                for (var i = 0; i < response.data.length; i++) {
                    for (var item in cart) {
                        if (response.data[i].name == cart[item].name && response.data[i].stock < cart[item].qty) {
                            res.push(cart[item].name);
                        }
                    }
                }
                console.log("res = ", res);
                if (res.length == 0) {    //库存都够
                    console.log("Can order!");
                    OrderService.addToOrder(username, cart, totalprice, currenttime);
                    OrderService.updateStock(cart);
                    CartService.clearCart(username);
                } else {    // 有库存不够的，加入购物车
                    alert("Not enough dish : " + res);
                    $location.path('ordersummary');
                }

            }, function errorCallback(response) {
                console.log('error');
            });

    };

    OrderService.updateStock = function (cart) {
        console.log("cart = ",cart);
        $http.get("/api/dish")
            .then(function successCallback(response) {
                console.log("response.data = ", response.data);
                for (var i = 0; i < response.data.length; i++) {
                    for (item in cart) {
                        if (response.data[i].name == cart[item].name) {
                            // console.log("cart[item].name", cart[item].name);
                            response.data[i].stock = response.data[i].stock - cart[item].qty;
                            // console.log(response.data[i].name);
                            var user = response.data[i];
                            console.log("user : ", user);
                            var parameter = JSON.stringify(user);
                            $http.post('/api/dish/' + user['_id'], parameter)
                                .success(function (data, status, headers, congig) {
                                    console.log('成功');
                                })
                                .error(function (data, status, headers, congig) {
                                    console.log('未成功');
                                });
                        }
                    }

                }



                //console.log(response);
            }, function errorCallback(response) {
                console.log('error');
            });
    };
    return OrderService;
});