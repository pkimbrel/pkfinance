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
                deferred.reject("Invalid date.");
            }
            return deferred.promise;
        },
        "validateCurrency": function (data) {
            var deferred = $q.defer();
            var regex = /^\d+(?:\.\d{0,2}){0,1}$/;
            if (regex.test(data)) {
                deferred.resolve();
            } else {
                deferred.reject("Invalid amount.");
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
    var cache = {};
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
            deferred.resolve();
            return deferred.promise;
        },
        "readCheckbook": function ($scope) {
            $http.get('../data/Checking-2013-08.json').success(function (data) {
                $scope.startingBalance = data.startingBalance;
                $scope.transactions = data.transactions;
                $scope.endingBalance = function (isBank) {
                    var balance = $scope.startingBalance;
                    angular.forEach($scope.transactions, function (transaction) {
                        if (!isBank || transaction.cleared) {
                            var amount = transaction.amount * ((transaction.type == "Debit") ? -1 : 1);
                            balance += amount;
                        }
                    });
                    return balance;
                };
            });
        },
        "readCategories": function ($scope) {
            /* if (cache["categories"] !== null) {
                    $scope.categories = cache["categories"];
            } else {*/
            $http.get('../data/categories.json').success(function (data) {
                //cache["categories"] = data.categories;
                $scope.categories = data.categories;
            });
            //}
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
        "amount": validators.validateCurrency,
        "description": validators.skipValidation,
        "category": validators.skipValidation,
        "type": validators.skipValidation,
        "cleared": validators.skipValidation
    };

    dataManager.readCategories($scope);
    dataManager.readCheckbook($scope);

    $scope.order = ["cleared", "-date"];
    $scope.type = ["Debit", "Credit"];

    $scope.validateAndUpdate = function (field, data, id) {
        var promise = validationBindings[field](data, $q).then(function () {
            return dataManager.updateCheckbook(field, data, id, $q);
        });
        return promise;
    };

    $scope.flattenCategories = function () {
        var list = [];
        angular.forEach($scope.categories, function (group) {
            angular.forEach(group.children, function (category) {
                list.push({
                    "category": category.text,
                    "group": group.text
                });
            });
        });
        return list;
    };
});