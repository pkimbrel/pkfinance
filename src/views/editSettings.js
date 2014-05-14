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
            settings.updateSettings($scope.newSettings).then(function() {
                $state.transitionTo($rootScope.previousState);
            }).catch(function() {
                alert("Update failed");
                $scope.isUpdating = false;
            });
        };
        
        $scope.addBlackout = function () {
            if ($scope.newSettings.blackoutPositions === undefined) {
                $scope.newSettings.blackoutPositions = [];
            }
            
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
        
        $scope.addSummaryCategory = function () {
            if ($scope.newSettings.summaryCategories === undefined) {
                $scope.newSettings.summaryCategories = [];
            }
            if ($scope.newSettings.summaryCategories.indexOf("") != -1) {
                alert("Please select a category before adding a new one.");
                return;
            }
            $scope.newSettings.summaryCategories.push("");
        };
        
        $scope.removeSummaryCategory = function (index) {
            if (confirm("Are you sure?")) {
                $scope.newSettings.summaryCategories.splice(index, 1);
            }
        };
        
        $scope.moveUpSummaryCategory = function(index) {
            if (index > 0) {
                $scope.newSettings.summaryCategories.swapItems(index, index-1);
            }
        };
        
        $scope.moveDownSummaryCategory = function(index) {
            if (index < ($scope.newSettings.summaryCategories.length - 1)) {
                $scope.newSettings.summaryCategories.swapItems(index, index+1);
            }
        };
        
        $scope.changeSummaryCategories = function() {
            console.log("HERE");
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