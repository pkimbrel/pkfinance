pkfinance.controller('Transactions', ['$scope', '$q', 'validators', 'dataAccessor', 'applicationScope',
    function ($scope, $q, validators, dataAccessor, applicationScope) {
        $scope.app = applicationScope;

        $scope.getIncome = function () {
            var income = [];
            angular.forEach(applicationScope.b, function (group) {
                angular.forEach(group.children, function (category) {
                    list.push({
                        "category": category.text,
                        "group": group.text
                    });
                });
            });
            return income;
        };
    }
]);
