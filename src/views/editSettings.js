pkfinance.controller('Settings', ['$rootScope', '$scope', '$state', '$q', 'validators', 'dataAccessor', 'applicationScope', 'settings', 'geoServices',
    function ($rootScope, $scope, $state, $q, validators, dataAccessor, applicationScope, settings, geoServices) {
        $scope.app = applicationScope;
        $scope.originalSettings = settings.readAllSettings;
        $scope.newSettings = {};
        
        $scope.$watch("originalSettings()", function (updatedSettings) {
            $scope.newSettings = angular.copy(updatedSettings);
        });
        
        $scope.submit = function () {
            
        };
        
        $('.help').popover({selector: '[rel=popover]'});
        $('.help').popover('show');
    }
]);