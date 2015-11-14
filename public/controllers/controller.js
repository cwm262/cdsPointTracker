var myApp = angular.module('myApp', ['ui.bootstrap']);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http){

    /* Refresh is called to update the table/list */
    var refresh = function(){
        $http.get('/studentlist').then(function(response){
            $scope.studentlist = response.data;
            $scope.student = "";
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
        $http.post('/studentlist', $scope.student);
        $http.post('/studentlog', $scope.student);
        refresh();
    };

    /* Remove a student from the list */
    $scope.remove = function(id){
        $http.delete('/studentlist/' + id).success(function(){
            refresh();    
        });
    };

    /* Edit grabs a student by ID and sets that to the edit input area */
    $scope.edit = function(id){
        $http.get('/studentlist/' + id).success(function(response){
            $scope.student = response;
        });
    };

    /* Update is the edit's submit button */
    $scope.update = function(){
        $http.put('/studentlist/' + $scope.student._id, $scope.student).success(function(response){
            refresh();
            $scope.logAction("edit", response);
        }); 
    };

    /* Clear selection */
    $scope.deselect = function(){
        $scope.student = "";    
    };

    $scope.getHistory = function(pawPrint){
        $http.get('/studentlog/' + pawPrint).success(function(response){
            $scope.history = response;
        });
    };
}]);
