/**
 * Created by pkimbrel on 3/26/14.
 */
$(document).ready(function () {

    $('.sidebar').affix();

    $.fn.editable.defaults.mode = 'inline';
    $.fn.editable.defaults.ajaxOptions = {
        type: "GET"
    };


});

var pkfinance = angular.module('pkfinance', []);

pkfinance.controller('Transactions', function ($scope, $http) {
    $http.get('../data/Checking-2014-03.json').success(function (data) {
        $scope.startingBalance = data.startingBalance;
        $scope.transactions = data.transactions;
    });
    $scope.order = ["cleared", "date"];
});
