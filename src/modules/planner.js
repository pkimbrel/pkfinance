pkfinance.controller('Planner', ['$scope', '$q', 'validators', 'dataAccessor', 'applicationScope',
    function ($scope, $q, validators, dataAccessor, applicationScope) {
        $scope.app = applicationScope;

        $scope.week1 = {};
        $scope.week2 = {};

        angularjs.forEach(applicationScope.planner.events.income, function (event) {

            }
        });
]);
