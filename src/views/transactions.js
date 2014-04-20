pkfinance.controller('Transactions', ['$scope', '$q', 'validators', 'dataAccessor', 'applicationScope',
    function ($scope, $q, validators, dataAccessor, applicationScope) {
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

        $scope.order = ["cleared", "-date"];

        $scope.validateAndUpdate = function (field, data, id) {
            var value = data;

            var promise = validationBindings[field](value, $q).then(function () {
                if (field == "amount") {
                    value = data * 100;
                }
                return dataAccessor.updateCheckbook(field, value, id, $q);
            });
            return promise;
        };

        $scope.flattenCategories = applicationScope.flattenCategories;
    }
]);
