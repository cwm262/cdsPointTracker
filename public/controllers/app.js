var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/signin', {
                templateUrl: '/views/login.html',
                controller: 'AppCtrl'
            })
            .when('/', {
                templateUrl: '/views/home.html',
                controller: 'AppCtrl'
            })
            .when('/signup',{
                templateUrl: '/views/signup.html',
                controller: 'AppCtrl'
            })
            .otherwise({
                redirectTo: '/signin'
            });
    }]);