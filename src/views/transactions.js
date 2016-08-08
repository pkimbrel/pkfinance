pkfinance.controller('Transactions', ['$scope', '$q', '$filter', 'validators', 'dataAccessor', 'applicationScope',
    function ($scope, $q, $filter, validators, dataAccessor, applicationScope) {
        var validationBindings = {
            "date": validators.validateDate,
            "amount": validators.validateCurrency,
            "description": validators.skipValidation,
            "category": validators.skipValidation,
            "type": validators.skipValidation,
            "cleared": validators.skipValidation
        };

        $scope.app = applicationScope;

        function buildSearchFilter() {
            var searchFilter = applicationScope.searchFilter;
            var index = searchFilter.indexOf(":");
            if (index != -1) {
                var key = searchFilter.substring(0, index);
                var value = searchFilter.substring(index + 1).toLowerCase();
                if (key.toLowerCase() == "category") {
                    searchFilter = function (item) {
                        var passed = false;
                        var category = item.category.toLowerCase();
                        if (category.indexOf(value) != -1) {
                            passed = true;
                        }
                        angular.forEach(item.categories, function (child) {
                            var category = child.category.toLowerCase();
                            if (category.indexOf(value) != -1) {
                                passed = true;
                            }
                        });

                        return passed;
                    };
                } else {
                    searchFilter = {};
                    searchFilter[key] = value;
                }
            }
            return searchFilter;
        }

        $scope.$watch("app.searchFilter", function (newValue) {
            var searchFilter;

            if (applicationScope.searchFilter !== undefined) {
                searchFilter = buildSearchFilter();
            }
            $scope.transactionFilter = searchFilter;

        });

        $scope.$watch("transactionFilter", function (newValue) {
            if ((newValue !== undefined) && (newValue !== "")) {
                var filteredArray = $filter('filter')($scope.app.transactions, newValue);
                var balance = 0;
                angular.forEach(filteredArray, function (transaction) {
                    var amount = transaction.amount * ((transaction.type === "Debit") ? -1 : 1);
                    balance += amount;
                });
                $scope.app.filterCount = filteredArray.length;
                $scope.app.filterAmount = balance;
            } else {
                $scope.app.filterCount = 0;
                $scope.app.filterAmount = 0;
            }
        });

        $scope.order = ["cleared", "-date", "description"];

        $scope.removeTransaction = function (id) {
            if (confirm("Are you sure?")) {
                dataAccessor.removeTransaction(applicationScope.account, applicationScope.payPeriod, id).then(function () {
                    var deleteIndex = 0;
                    angular.forEach(applicationScope.transactions, function (transaction, index) {
                        if (transaction.tranid == id) {
                            deleteIndex = index;
                        }
                    });

                    applicationScope.transactions.splice(deleteIndex, 1);
                }, function() {
                    alert("Unable to remove transaction");
                });
            }
        };

        $scope.validateAndUpdate = function (field, data, id) {
            var value = data;

            var promise = validationBindings[field](value, $q).then(function () {
                if (field == "amount") {
                    value = data * 100;
                }
                return dataAccessor.updateTransaction(applicationScope.account, applicationScope.payPeriod, id, field, value);
            });
            
            if (field == "cleared") {
                promise.catch(function() {
                    angular.forEach(applicationScope.transactions, function (transaction) {
                        if (transaction.tranid == id) {
                            transaction.cleared = !data;
                        }
                    });
                });
            } else {
                return promise;
            }
        };
        
        $scope.updateAmount = function(id) {
            angular.forEach(applicationScope.transactions, function (transaction) {
                if (transaction.tranid == id) {
                    transaction.amount = transaction.displayAmount * 100;
                }
            });
        };

        $scope.flattenCategories = applicationScope.flattenCategories;
    }
]);