var myApp = angular.module('myApp', ['ui.bootstrap']);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http){

    $scope.error = "";

    $scope.student = {
        name: "",
        pawPrint: "",
        pointTotal: 0
    };

    $scope.points = {
        number: 0,
        description: "",
        author: ""
    };

    $scope.warnings = {
        type: "",
        description: "",
        author: ""
    };

    /* Refresh is called to update the table/list */
    var refresh = function(){
        $http.get('/studentlist').then(function(response){
            $scope.studentlist = response.data;
            $scope.student.name = "";
            $scope.student.pawPrint = "";
            $scope.points.number = 0;
            $scope.points.description = "";
            $scope.points.author = "";
            $scope.warnings.type = "";
            $scope.warnings.description = "";
            $scope.warnings.author = "";
        });
    };

    refresh();

    /* showDetail sets to active the student object (s) pertaining to the selected row */
    $scope.showDetail = function(s){
        if($scope.active != s){
            $scope.active = s;
        }
        else{
            $scope.active = null;
        }
    };

    /* Add a student to the list */
    $scope.addStudent = function(){
        $http.post('/studentlist', $scope.student).success(function(){
            refresh();
        });
    };

    $scope.warn = function(id){
        $http.post('/studentwarnings/' + id, $scope.warnings).success(function(){
            refresh();
        });
    };

    /* Remove a student from the list */
    $scope.remove = function(id){
        $http.delete('/studentlist/' + id).success(function(){
            refresh();    
        });
    };

    $scope.removeLog = function(id){
        $http.delete('/studentlog/' + id);
    };

    $scope.removeWarnings = function(id){
        $http.delete('/studentwarnings/' + id);
    };

    /* Update is the edit's submit button */
    $scope.update = function(id){
        if($scope.points.number == 0){
            $scope.error = "You cannot submit 0 points.";
            return;
        }
        $http.put('/studentlist/' + id, $scope.points).success(function(){
            refresh();
        }); 
    };

    /* Clear selection */
    $scope.deselect = function(){
        $scope.student = "";    
    };

    $scope.getHistory = function(id){
        $http.get('/studentlog/' + id).success(function(response){
            $scope.history = response;
        });
    };

    $scope.getWarnings = function(id){
        $http.get('/studentwarnings/' + id).success(function(response){
            $scope.warnHistory = response;
        });
    };
}]);
