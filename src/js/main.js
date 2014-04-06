/**
 * Created by pkimbrel on 3/26/14.
 */

var pkfinance = angular.module('pkfinance', ['xeditable']);

pkfinance.factory('validators', function ($q, $http) {
    return {
        "validateDate": function (data) {
            var deferred = $q.defer();
            if (moment(data).isValid()) {
                deferred.resolve();
            } else {
                deferred.reject("Please enter a valid date.");
            }
            return deferred.promise;
        },
        "skipValidation": function (data) {
            var deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        }
    };
});

pkfinance.factory('dataManager', function ($q, $http) {
    return {
        "updateCheckbook": function (field, data, id) {
            var deferred = $q.defer();

            $http.post('/update', {
                value: data
            }).success(function (response) {
                response = response || {};
                if (response.status === 'ok') {
                    deferred.resolve();
                } else {
                    deferred.resolve(response.msg);
                }
            }).error(function (ex) {
                deferred.reject('Server error!');
            });
            return deferred.promise;
        },
        "readCheckbook": function ($scope) {
            $http.get('../data/Checking-2014-03.json').success(function (data) {
                $scope.startingBalance = data.startingBalance;
                $scope.transactions = data.transactions;
            });
        }
    };
});


pkfinance.run(function (editableOptions) {
    $('.sidebar').affix();
    editableOptions.theme = 'bs3';
});

pkfinance.controller('Transactions', function ($scope, $q, validators, dataManager) {

    var validationBindings = {
        "date": validators.validateDate,
        "description": validators.skipValidation
    };

    dataManager.readCheckbook($scope);

    $scope.order = ["cleared", "-date"];

    $scope.validateAndUpdate = function (field, data, id) {
        var promise = validationBindings[field](data, $q).then(function () {
            return dataManager.updateDatabase(field, data, id, $q, $http);
        });
        return promise;
    };
});
