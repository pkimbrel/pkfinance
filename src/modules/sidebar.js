pkfinance.controller('Sidebar', ['$scope', 'applicationScope',
    function ($scope, applicationScope) {
        $scope.app = applicationScope;
        $scope.clear = function () {
            applicationScope.searchFilter = "";
        }
    }
]);
