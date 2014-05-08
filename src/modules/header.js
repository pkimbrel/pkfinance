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

pkfinance.controller('Header', ['$rootScope', '$scope', '$state',
    function ($rootScope, $scope, $state) {
        $scope.logout = function () {
            localStorage.removeItem("token");
            document.cookie = "XSRF-TOKEN=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
            $rootScope.isAuthenticated = false;
            $state.go("login");
        };
    }
]);