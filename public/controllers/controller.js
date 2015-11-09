var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http){
    
    var refresh = function(){
        $http.get('/studentlist').then(function(response){
            $scope.studentlist = response.data;
            $scope.student = "";
        });
    };
    
    refresh();
    
    $scope.addStudent = function(){
        $http.post('/studentlist', $scope.student);
        refresh();
    };
    
    $scope.remove = function(id){
        $http.delete('/studentlist/' + id).success(function(response){
            refresh();    
        });
    };
    
    $scope.edit = function(id){
        $http.get('/studentlist/' + id).success(function(response){
            $scope.student = response;
        });
    };
    
    $scope.update = function(){
        $http.put('/studentlist/' + $scope.student._id, $scope.student).success(function(response){
            refresh();    
        }); 
    };
    
    $scope.deselect = function(){
        $scope.student = "";    
    };
}]);
