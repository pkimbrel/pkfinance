/**
 * Services
 */
/* global pkfinance, angular, localStorage, moment */

pkfinance.factory('applicationScope', ['$q', '$http', 'dataAccessor',
    function ($q, $http, dataAccessor) {
        var applicationScope = {};

        if (localStorage.getItem("payPeriod") === null) {
            applicationScope.payPeriod = "2013-08";
        } else {
            applicationScope.payPeriod = localStorage.getItem("payPeriod");
        }

        applicationScope.availablePayPeriods = [
            "2013-08",
            "2013-09"
        ];

        dataAccessor.readCategories().then(function (data) {
            applicationScope.categories = data.categories;
        });

        applicationScope.updateTransactions = function () {
            localStorage.payPeriod = applicationScope.payPeriod;
            dataAccessor.readCheckbook(applicationScope.payPeriod).then(function (data) {
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
        };

        applicationScope.updateTransactions();

        applicationScope.flattenCategories = function () {
            var list = [];
            angular.forEach(applicationScope.categories, function (group) {
                angular.forEach(group.children, function (category) {
                    list.push({
                        "category": category.text,
                        "group": group.text
                    });
                });
            });
            return list;
        };

        applicationScope.transactionTypes = ["Debit", "Credit"];


        return applicationScope;
    }
]);

pkfinance.factory('dataAccessor', ['$q', '$http', 'DATA_FOLDER',
    function ($q, $http, DATA_FOLDER) {
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
            "readCheckbook": function (payPeriod) {
                var deferred = $q.defer();

                $http.get(DATA_FOLDER + '/Checking-' + payPeriod + '.json').success(function (data) {
                    deferred.resolve(data);
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "readCategories": function () {
                var deferred = $q.defer();

                $http.get(DATA_FOLDER + '/categories.json').success(function (data) {
                    deferred.resolve(data);
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            }
        };
    }
]);

pkfinance.factory('validators', ['$q', '$http',
    function ($q, $http) {
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
    }
]);

pkfinance.factory('authService', ['$q', '$http',
    function ($q, $http) {
        return {
            "isAuthenticated": function () {
                var deferred = $q.defer();

                var token = localStorage.getItem("token");
                if (token === null) {
                    deferred.reject('No token!');
                } else {
                    $http.post("https://finance.paulkimbrel.com/auth/", "token=" + token)
                        .success(function (response) {
                            deferred.resolve();
                        }).error(function (ex) {
                            deferred.reject('Rejected!');
                        });
                }

                return deferred.promise;
            }
        };
    }
]);