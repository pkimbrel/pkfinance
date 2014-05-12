pkfinance.controller('Settings', ['$rootScope', '$scope', '$state', '$q', 'validators', 'dataAccessor', 'applicationScope', 'settings', 'geoServices',
    function ($rootScope, $scope, $state, $q, validators, dataAccessor, applicationScope, settings, geoServices) {
        $scope.app = applicationScope;
        $scope.originalSettings = settings.readAllSettings;
        $scope.newSettings = {};
        $scope.isUpdating = false;
        
        $scope.$watch("originalSettings()", function (updatedSettings) {
            $scope.newSettings = angular.copy(updatedSettings);
        });
        
        $scope.submit = function () {
            $scope.isUpdating = true;
        };
        
        $scope.addBlackout = function () {
            $scope.newSettings.blackoutPositions.push({
                "latitude": "0",
                "longitude": "0"
            });
        };
        
        $scope.removeBlackout = function (index) {
            if (confirm("Are you sure?")) {
                $scope.newSettings.blackoutPositions.splice(index, 1);
            }
        };
        
        $scope.locateBlackout = function (index) {
            dataAccessor.getPosition().then(function (currentPosition) {
                $scope.newSettings.blackoutPositions[index] = currentPosition;
            });

        };
        
        $scope.cancel = function () {
            $state.transitionTo($rootScope.previousState);
        };
        
        $scope.isSame = function () {
            var originalSettings = $scope.originalSettings();
            return angular.equals(originalSettings, $scope.newSettings);
        };
        
        $('.help').popover();
    }
]);