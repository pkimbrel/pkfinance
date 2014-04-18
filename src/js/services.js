/**
 * Services
 */
/* global pkfinance, angular, localStorage, moment */

pkfinance.factory('applicationScope', ['$q', '$http', 'dataAccessor', 'START_DATE',
    function ($q, $http, dataAccessor, START_DATE) {
        var applicationScope = {};

        function calculateEndingBalance(isBank) {
            var balance = applicationScope.startingBalance;
            angular.forEach(applicationScope.transactions, function (transaction) {
                if (!isBank || transaction.cleared) {
                    var amount = transaction.amount * ((transaction.type == "Debit") ? -1 : 1);
                    balance += amount;
                }
            });
            return balance;
        }

        function calculateTotalIncome() {
            var totalIncome = 0;
            angular.forEach(applicationScope.budget.income, function (value, key) {
                totalIncome += Number(value);
            });
            return totalIncome;
        }

        function calculateTotalSpending() {
            var totalSpending = 0;
            angular.forEach(applicationScope.budget.spending, function (value, key) {
                totalSpending += Number(value);
            });
            return totalSpending;
        }

        function calculateDateRange() {
            var startDate = moment(START_DATE);
            var startYear = startDate.year();

            var parsedPeriod = /([0-9]{4})-([0-9]{2})/.exec(applicationScope.payPeriod);

            var periodYear = parsedPeriod[1];
            var periodDifference = Number(parsedPeriod[2]) + (periodYear - startYear) * 13;

            var periodStartDate = moment(startDate).add('days', (periodDifference - 1) * 28);
            var periodEndDate = moment(periodStartDate).add('days', 27);

            applicationScope.startDate = periodStartDate.toDate();
            applicationScope.endDate = periodEndDate.toDate();

            applicationScope.isCurrent = (
                (periodStartDate.valueOf() < moment().valueOf()) &&
                (periodEndDate.valueOf() > moment().valueOf())
            );
        }

        if (localStorage.getItem("payPeriod") === null) {
            applicationScope.payPeriod = "2014-08";
        } else {
            applicationScope.payPeriod = localStorage.getItem("payPeriod");
        }

        applicationScope.availablePayPeriods = [
            "2013-08",
            "2013-09",
            "2013-10",
            "2013-11",
            "2013-12",
            "2013-13",
            "2014-01",
            "2014-02",
            "2014-03",
            "2014-04",
            "2014-05",
            "2014-06",
            "2014-07",
            "2014-08"
        ];

        applicationScope.updateApplicationScope = function () {
            applicationScope.transactions = undefined;
            applicationScope.budget = undefined;

            localStorage.payPeriod = applicationScope.payPeriod;
            calculateDateRange();
            dataAccessor.readCheckbook(applicationScope.payPeriod).then(function (data) {
                applicationScope.transactions = data.transactions;

                angular.forEach(applicationScope.transactions, function (transaction) {
                    transaction.displayAmount = (transaction.amount / 100).toFixed(2);
                });

                applicationScope.startingBalance = data.startingBalance;
                applicationScope.endingBalance = calculateEndingBalance;

                dataAccessor.readBudget(applicationScope.payPeriod).then(function (data) {
                    applicationScope.budget = data;
                    applicationScope.totalIncome = calculateTotalIncome();
                    applicationScope.totalSpending = calculateTotalSpending();
                    applicationScope.difference = applicationScope.totalIncome - applicationScope.totalSpending;
                });
            });

            dataAccessor.readFixedEvents(applicationScope.payPeriod).then(function (data) {
                applicationScope.planner = data;
            });

        };

        dataAccessor.readCategories().then(function (data) {
            applicationScope.categories = data.categories;
            applicationScope.updateApplicationScope();
        });

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
            "updateBudget": function (field, data) {
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
            "readFixedEvents": function () {
                var deferred = $q.defer();

                $http.get(DATA_FOLDER + '/fixedEvents.json').success(function (data) {
                    deferred.resolve(data);
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "readCheckbook": function (payPeriod) {
                var deferred = $q.defer();

                $http.get(DATA_FOLDER + '/transactions/Checking-' + payPeriod + '.json').success(function (data) {
                    deferred.resolve(data);
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "readBudget": function (payPeriod) {
                var deferred = $q.defer();

                $http.get(DATA_FOLDER + '/budget/budget-' + payPeriod + '.json').success(function (data) {
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
