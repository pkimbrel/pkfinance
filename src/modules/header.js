/* global pkfinance, angular, localStorage */
pkfinance.controller('Head', ['$scope', '$state',
    function ($scope, $state) {
        $scope.currentState = function () {
            if (($state.current.name == "summary") ||
                ($state.current.name == "register") ||
                ($state.current.name == "budget") ||
                ($state.current.name == "planner")) {
                return "main";
            } else {
                return "new";
            }
        };
    }
]);

pkfinance.controller('Header', ['$scope', '$state',
    function ($scope, $state) {
        $scope.logout = function () {
            localStorage.removeItem("token");
            $state.go("login");
        };
    }
]);
