/**
 * Services
 */
/* global pkfinance, angular, localStorage, moment */

pkfinance.factory('applicationScope', ['$q', '$rootScope', '$http', 'dataAccessor', 'settings',
    function ($q, $rootScope, $http, dataAccessor, settings) {
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
            var flattenedCategories = applicationScope.reallyFlattenCategories();
            angular.forEach(applicationScope.budget.income, function (value, key) {
                if (flattenedCategories.indexOf(key) != -1) {
                    totalIncome += Number(value);
                }
            });
            return totalIncome;
        }

        function calculateTotalSpending() {
            var totalSpending = 0;
            var flattenedCategories = applicationScope.reallyFlattenCategories();
            angular.forEach(applicationScope.budget.spending, function (value, key) {
                if (flattenedCategories.indexOf(key) != -1) {
                    totalSpending += Number(value);
                }
            });
            return totalSpending;
        }

        function calculateDifference() {
            return calculateTotalIncome() - calculateTotalSpending();
        }

        function calculateDateRange() {
            var startDate = moment(settings.readSetting("startDate"));
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

        function initiatePayPeriod() {
            if (sessionStorage.getItem("payPeriod") === null) {
                applicationScope.payPeriod = applicationScope.calculateCurrentPayPeriod();
            } else {
                applicationScope.payPeriod = sessionStorage.getItem("payPeriod");
            }
        }

        applicationScope.calculateCurrentPayPeriod = function () {
            var payPeriod = "2013-08";
            var startDateSetting = settings.readSetting("startDate", null);
            if (startDateSetting !== null) {
                var startDate = moment(startDateSetting);
                var currentDate = moment();
                var periodsSinceStart = Number(((currentDate.diff(startDate, 'days')) / 28).toFixed(0));
                var yearsSinceStart = Number((periodsSinceStart / 13).toFixed(0));
                var payPeriodInYear = periodsSinceStart - (yearsSinceStart * 13);
                var year = startDate.year() + yearsSinceStart;
                payPeriod = year + "-" + ((payPeriodInYear < 10) ? "0" : "") + payPeriodInYear;
            }
            return payPeriod;
        };

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
            "2014-08",
            "2014-09",
            "2014-10",
            "2014-11",
            "2014-12",
            "2014-13"
        ];

        applicationScope.updateApplicationScope = function () {
            applicationScope.transactions = undefined;
            applicationScope.budget = undefined;

            applicationScope.totalIncome = 0;
            applicationScope.totalSpending = 0;
            applicationScope.difference = 0;
            applicationScope.startingBalance = 0;
            applicationScope.bankBalance = 0;

            if (applicationScope.payPeriod === undefined) {
                initiatePayPeriod();
            }

            sessionStorage.payPeriod = applicationScope.payPeriod;

            calculateDateRange();

            dataAccessor.readFixedEvents(applicationScope.payPeriod).then(function (data) {
                applicationScope.planner = data;
            });

            dataAccessor.readCheckbook(applicationScope.payPeriod).then(function (data) {
                applicationScope.transactions = data.transactions;

                angular.forEach(applicationScope.transactions, function (transaction) {
                    transaction.isSplit = (transaction.category == "Split");
                    transaction.displayAmount = (transaction.amount / 100).toFixed(2);
                });

                applicationScope.startingBalance = data.startingBalance;
                applicationScope.endingBalance = calculateEndingBalance;

                dataAccessor.readBudget(applicationScope.payPeriod).then(function (data) {
                    applicationScope.budget = data;
                    applicationScope.totalIncome = calculateTotalIncome;
                    applicationScope.totalSpending = calculateTotalSpending;
                    applicationScope.difference = calculateDifference;
                });
            });
        };

        applicationScope.transactionTypes = ["Debit", "Credit"];

        applicationScope.flattenCategories = function (skipSplit) {
            var list = [];

            if (!skipSplit) {
                list.push({
                    "category": "Split",
                    "group": "Split"
                });
            }
            angular.forEach(applicationScope.categories, function (group) {
                angular.forEach(group.children, function (category) {
                    list.push({
                        "category": category,
                        "group": group.text
                    });
                });
            });
            return list;
        };

        applicationScope.reallyFlattenCategories = function (skipSplit) {
            var list = [];


            angular.forEach(applicationScope.categories, function (group) {
                angular.forEach(group.children, function (category) {
                    list.push(category);
                });
            });
            return list;
        };

        applicationScope.flattenSpendingCategories = function () {
            var list = [];

            angular.forEach(applicationScope.categories, function (group) {
                if (group.text != "Income") {
                    angular.forEach(group.children, function (category) {
                        list.push({
                            "category": category,
                            "group": group.text
                        });
                    });
                }
            });
            return list;
        };

        $rootScope.$watch("isAuthenticated", function (isAuthenticated) {
            if (isAuthenticated) {
                settings.loadSettings().then(function () {
                    dataAccessor.readCategories().then(function (data) {
                        applicationScope.categories = data;
                        applicationScope.updateApplicationScope();
                    });
                });
            }
        });

        return applicationScope;
}]);

pkfinance.factory('geoServices', ['settings', 'dataAccessor',
    function (settings, dataAccessor) {
        function calculateDistance(startPosition, endPosition) {
            var latitude1 = Number(startPosition.latitude).toRad();
            var longitude1 = Number(startPosition.longitude).toRad();

            var latitude2 = Number(endPosition.latitude).toRad();
            var longitude2 = Number(endPosition.longitude).toRad();

            var worldRadius = 6371000; // m
            var deltaLatitude = (latitude2 - latitude1);
            var deltaLongitude = (longitude2 - longitude1);

            var alpha = Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
                Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2) *
                Math.cos(latitude1) * Math.cos(latitude2);
            var ratio = 2 * Math.atan2(Math.sqrt(alpha), Math.sqrt(1 - alpha));

            var distance = (worldRadius * ratio).toFixed(3);
            //console.log(distance);
            return distance;
        }

        function isBlackedOut(currentPosition) {
            var blackoutPositions = settings.readSetting("blackoutPositions", null);
            var blackoutRadius = Number(settings.readSetting("blackoutRadius", 25));

            if ((blackoutPositions !== null) && (currentPosition !== null)) {
                for (var index in blackoutPositions) {
                    if (calculateDistance(currentPosition, blackoutPositions[index]) < blackoutRadius) {
                        return true;
                    }
                }
                return false;
            } else {
                return true;
            }

        }

        return {
            "isBlackedOut": function (currentPosition) {
                return isBlackedOut(currentPosition);
            },
            "calculateDistance": function (startPosition, endPosition) {
                return calculateDistance(startPosition, endPosition);
            }
        };
    }
]);


pkfinance.factory('settings', ['$q', '$http', 'DATA_FOLDER',
    function ($q, $http, DATA_FOLDER) {
        var settings = {};
        return {
            "loadSettings": function () {
                var deferred = $q.defer();

                $http.get(DATA_FOLDER + 'settings').success(function (data) {
                    settings = data;
                    deferred.resolve();
                }).error(function (ex) {
                    settings = {};
                    deferred.resolve();
                });

                return deferred.promise;
            },
            "readSetting": function (key, defaultValue) {
                if (settings[key] !== undefined) {
                    return settings[key];
                }

                return defaultValue;
            },
            "updateSettings": function (newSettings) {
                var deferred = $q.defer();

                $http.post(DATA_FOLDER + 'settings', newSettings).success(function (response) {
                    settings = angular.copy(newSettings);
                    deferred.resolve();
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "readAllSettings": function (key, defaultValue) {
                return settings;
            }
        };
    }
]);

pkfinance.factory('dataAccessor', ['$q', '$http', 'settings', 'DATA_FOLDER',
    function ($q, $http, settings, DATA_FOLDER) {
        return {
            "removeTransaction": function (payPeriod, id) {
                var deferred = $q.defer();

                $http.delete(DATA_FOLDER + 'checking/' + payPeriod + "/" + id).success(function (response) {
                    deferred.resolve();
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "updateTransaction": function (payPeriod, id, field, data) {
                var deferred = $q.defer();

                $http.put(DATA_FOLDER + 'checking/' + payPeriod + "/" + id, {
                    field: field,
                    data: data
                }).success(function (response) {
                    deferred.resolve();
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "newTransaction": function (payPeriod, id, data) {
                var deferred = $q.defer();

                $http.post(DATA_FOLDER + 'checking/' + payPeriod + "/" + id, data).success(function (response) {
                    deferred.resolve();
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "updateBudget": function (payPeriod, category, amount, id) {
                var deferred = $q.defer();

                $http.put(DATA_FOLDER + 'budget/' + payPeriod + "/" + id, {
                    category: category,
                    amount: amount
                }).success(function (response) {
                    deferred.resolve();
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "readFixedEvents": function () {
                var deferred = $q.defer();

                $http.get(DATA_FOLDER + 'fixedEvents').success(function (data) {
                    deferred.resolve(data);
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "readCheckbook": function (payPeriod) {
                var deferred = $q.defer();

                $http.get(DATA_FOLDER + 'checking/' + payPeriod).success(function (data) {
                    deferred.resolve(data);
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "readBudget": function (payPeriod) {
                var deferred = $q.defer();

                $http.get(DATA_FOLDER + 'budget/' + payPeriod).success(function (data) {
                    deferred.resolve(data);
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "writeBudget": function (payPeriod, data) {
                var deferred = $q.defer();

                $http.post(DATA_FOLDER + 'budget/' + payPeriod, data).success(function () {
                    deferred.resolve();
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "readCategories": function () {
                var deferred = $q.defer();

                $http.get(DATA_FOLDER + 'categories').success(function (data) {
                    deferred.resolve(data);
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "updateCategories": function (newCategories) {
                var deferred = $q.defer();

                $http.post(DATA_FOLDER + 'categories', newCategories).success(function (response) {
                    deferred.resolve();
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "readTypeAhead": function () {
                var deferred = $q.defer();

                $http.get(DATA_FOLDER + 'typeahead').success(function (data) {
                    deferred.resolve(data);
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "updateTypeahead": function (typeaheadData) {
                var deferred = $q.defer();

                $http.post(DATA_FOLDER + 'typeahead', typeaheadData).success(function (response) {
                    deferred.resolve();
                }).error(function (ex) {
                    deferred.reject('Server error!');
                });

                return deferred.promise;
            },
            "getPosition": function () {
                var deferred = $q.defer();
                var currentPosition = settings.readSetting("currentPosition", null);

                if (currentPosition !== null) {
                    var split = currentPosition.split(",");
                    deferred.resolve({
                        "latitude": split[0],
                        "longitude": split[1]
                    });
                } else {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            deferred.resolve({
                                "latitude": position.coords.latitude,
                                "longitude": position.coords.longitude
                            });
                        }, function (positionError) {
                            deferred.reject('Unable to get current position');
                        });
                    } else {
                        deferred.reject('Geolocation Services unavailable');
                    }
                }

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

pkfinance.factory('authService', ['$q', '$http', 'DATA_FOLDER',
    function ($q, $http, DATA_FOLDER) {
        return {
            "isAuthenticated": function () {
                var deferred = $q.defer();

                var token = localStorage.getItem("token");
                if (token === null) {
                    deferred.reject('No token!');
                } else {
                    $http.post(DATA_FOLDER + "authenticate", "token=" + token)
                        .success(function (response, status, headers, config) {
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

if (typeof Number.prototype.toRad == 'undefined') {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    };
}

if (typeof Number.prototype.toDeg == 'undefined') {
    Number.prototype.toDeg = function () {
        return this * 180 / Math.PI;
    };
}

if (typeof Array.prototype.swapItems == 'undefined') {
    Array.prototype.swapItems = function (a, b) {
        this[a] = this.splice(b, 1, this[a])[0];
        return this;
    };
}