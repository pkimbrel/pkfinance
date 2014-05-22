pkfinance.controller('Typeahead', ['$rootScope', '$scope', '$state', '$q', 'validators', 'dataAccessor', 'applicationScope', 'settings', 'geoServices',
    function ($rootScope, $scope, $state, $q, validators, dataAccessor, applicationScope, settings, geoServices) {
        $scope.app = applicationScope;
        $scope.originalTypeahead = null;
        $scope.newTypeahead = null;

        $scope.isUpdating = false;
        $scope.isSame = function () {
            //return angular.equals($scope.newCategories, applicationScope.categories);
            return true;
        };

        $scope.submit = function () {};

        $scope.cancel = function () {
            $state.transitionTo($rootScope.previousState);
        };

        dataAccessor.readTypeAhead().then(function (typeahead) {
            $scope.originalTypeahead = typeahead;
            $scope.newTypeahead = typeahead;
        });
    }
]);