/**
 * Created by pkimbrel on 3/26/14.
 */

function logout() {
    document.cookie = "activate=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.location = "login.html";
}

var pkfinance = angular.module('pkfinance', ['ngCookies', 'ngRoute', 'xeditable']);

pkfinance.run(function (editableOptions, $cookies) {
    if ($cookies.activate === undefined) {
        document.location = "login.html";
    }

    $('.sidebar').affix();
    editableOptions.theme = 'bs3';
});

pkfinance.config(['$routeProvider',
  function ($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'templates/transactions.html',
            controller: 'Transactions'
        }).
        otherwise({
            redirectTo: '/'
        });
  }]);

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

pkfinance.factory('dataAccessor', function ($q, $http) {
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
        "readCheckbook": function () {
            var deferred = $q.defer();

            $http.get('../data/Checking-2013-08.json').success(function (data) {
                deferred.resolve(data);
            }).error(function (ex) {
                deferred.reject('Server error!');
            });

            return deferred.promise;
        },
        "readCategories": function () {
            var deferred = $q.defer();

            $http.get('../data/categories.json').success(function (data) {
                deferred.resolve(data);
            }).error(function (ex) {
                deferred.reject('Server error!');
            });

            return deferred.promise;
        }
    };
});

pkfinance.factory('applicationScope', function ($q, $http, dataAccessor) {
    var applicationScope = {};

    dataAccessor.readCategories().then(function (data) {
        applicationScope.categories = data.categories;
    });

    dataAccessor.readCheckbook().then(function (data) {
        applicationScope.transactions = data.transactions;

        applicationScope.startingBalance = data.startingBalance;
        applicationScope.endingBalance = function (isBank) {
            var balance = applicationScope.startingBalance;
            angular.forEach(applicationScope.transactions, function (transaction) {
                if (!isBank || transaction.cleared) {
                    var amount = transaction.amount * ((transaction.type == "Debit") ? -1 : 1);
                    balance += amount;
                }
            });
            return balance;
        };
    });

    return applicationScope;
});

pkfinance.controller('Sidebar', function ($scope, $q, validators, applicationScope) {
    $scope.app = applicationScope;
});

pkfinance.controller('Transactions', function ($scope, $q, validators, applicationScope) {
    var validationBindings = {
        "date": validators.validateDate,
        "amount": validators.validateCurrency,
        "description": validators.skipValidation,
        "category": validators.skipValidation,
        "type": validators.skipValidation,
        "cleared": validators.skipValidation
    };

    $scope.app = applicationScope;

    $scope.order = ["cleared", "-date"];
    $scope.type = ["Debit", "Credit"];

    $scope.validateAndUpdate = function (field, data, id) {
        var promise = validationBindings[field](data, $q).then(function () {
            return dataAccessor.updateCheckbook(field, data, id, $q);
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
