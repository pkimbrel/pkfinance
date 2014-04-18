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

        $scope.$watch("app.searchFilter", function (newValue) {
            if (applicationScope.searchFilter !== undefined) {
                var searchFilter = applicationScope.searchFilter;
                var index = searchFilter.indexOf(":");
                if (index != -1) {
                    var key = searchFilter.substring(0, index);
                    var value = searchFilter.substring(index + 1);
                    searchFilter = {};
                    searchFilter[key] = value;
                    /*if (key.toLowerCase() == "category") {
                        searchFilter["categories"] = value;
                    }*/
                }
                $scope.transactionFilter = searchFilter;
            }
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

        $scope.flattenCategories = function () {
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


    }
]);
