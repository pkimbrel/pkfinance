pkfinance.controller('FixedEvents', ['$rootScope', '$scope', '$state', '$q', 'validators', 'dataAccessor', 'applicationScope', 'settings', 'geoServices',
    function ($rootScope, $scope, $state, $q, validators, dataAccessor, applicationScope, settings, geoServices) {
        $scope.app = applicationScope;
        $scope.originalFixedEvents = null;
        $scope.newFixedEvents = null;

        $scope.isUpdating = false;
        $scope.isSame = function () {
            //return angular.equals($scope.newCategories, applicationScope.categories);
            return true;
        };

        $scope.submit = function () {};

        $scope.cancel = function () {
            $state.transitionTo($rootScope.previousState);
        };

        dataAccessor.readFixedEvents().then(function (fixedEvents) {
            $scope.originalFixedEvents = fixedEvents;
            $scope.newFixedEvents = fixedEvents;
        });
    }
]);