/**
 * Created by pkimbrel on 3/26/14.
 */
$(document).ready(function () {

    $('.sidebar').affix();

});

var pkfinance = angular.module('pkfinance', ['xeditable']);

pkfinance.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});

pkfinance.controller('Transactions', function ($scope, $http) {
    $http.get('../data/Checking-2014-03.json').success(function (data) {
        $scope.startingBalance = data.startingBalance;
        $scope.transactions = data.transactions;
    });

    $scope.order = ["cleared", "-date"];

    $scope.$watch('description', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            alert(newVal);
        }
    });
});