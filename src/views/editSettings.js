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
            settings.updateSettings($scope.newSettings).then(function () {
                $state.transitionTo($rootScope.previousState);
            }).catch(function () {
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
            if (confirm("Do you wish to overwrite the current value?")) {
                dataAccessor.getPosition().then(function (currentPosition) {
                    $scope.newSettings.blackoutPositions[index] = currentPosition;
                });
            }
        };

        $scope.mapBlackout = function (index) {
            var blackoutPosition = $scope.newSettings.blackoutPositions[index];
            var position = new google.maps.LatLng(blackoutPosition.latitude, blackoutPosition.longitude);

            if ($scope.map === undefined) {
                $("#blackout-map").html("<div class='map-canvas'>");
                var mapOptions = {
                    center: new google.maps.LatLng(39.810556, -98.556111),
                    zoom: 4
                };

                $scope.map = new google.maps.Map($("#blackout-map .map-canvas")[0], mapOptions);
            }

            $scope.map.setCenter(position);
            $scope.map.setZoom(16);

            if ($scope.blackoutMarker === undefined) {
                $scope.blackoutMarker = new google.maps.Marker({
                    position: position,
                    map: $scope.map,
                    title: "Blacked out"
                });
                var radiusOptions = {
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.6,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.15,
                    map: $scope.map,
                    center: position,
                    radius: $scope.newSettings.suggestionRadius
                };
                $scope.blackoutRadius = new google.maps.Circle(radiusOptions);

            } else {
                $scope.blackoutMarker.setPosition(position);
                $scope.blackoutRadius.setCenter(position);
                $scope.blackoutRadius.setRadius($scope.newSettings.suggestionRadius);
            }
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

        $scope.moveUpSummaryCategory = function (index) {
            if (index > 0) {
                $scope.newSettings.summaryCategories.swapItems(index, index - 1);
            }
        };

        $scope.moveDownSummaryCategory = function (index) {
            if (index < ($scope.newSettings.summaryCategories.length - 1)) {
                $scope.newSettings.summaryCategories.swapItems(index, index + 1);
            }
        };

        $scope.changeSummaryCategories = function () {
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
            }]);