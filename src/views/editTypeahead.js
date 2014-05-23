pkfinance.controller('Typeahead', ['$rootScope', '$scope', '$state', '$q', 'validators', 'dataAccessor', 'applicationScope', 'settings', 'geoServices',
    function ($rootScope, $scope, $state, $q, validators, dataAccessor, applicationScope, settings, geoServices) {
        $scope.app = applicationScope;
        $scope.originalTypeahead = null;
        $scope.newTypeahead = null;

        $scope.currentPosition = {
            latitude: "0.000",
            longitude: "0.000"
        };

        $scope.isUpdating = false;
        $scope.isSame = function () {
            return angular.equals($scope.newTypeahead, $scope.originalTypeahead);
        };

        $scope.submit = function () {};

        $scope.cancel = function () {
            $state.transitionTo($rootScope.previousState);
        };

        dataAccessor.readTypeAhead().then(function (typeahead) {
            $scope.originalTypeahead = typeahead;
            $scope.newTypeahead = angular.copy(typeahead);

            $("#typeahead-map").affix();

            $scope.geoServicesEnabled = settings.readSetting("geoLocationEnabled", true);
            if ($scope.geoServicesEnabled) {
                dataAccessor.getPosition().then(function (currentPosition) {
                    $scope.currentPosition = currentPosition;

                    if ($scope.map === undefined) {
                        $("#typeahead-map").html("<div class='map-canvas'>");
                        var mapOptions = {
                            center: new google.maps.LatLng(39.810556, -98.556111),
                            zoom: 4
                        };

                        $scope.map = new google.maps.Map($("#typeahead-map .map-canvas")[0], mapOptions);
                    }

                    var position = new google.maps.LatLng($scope.currentPosition.latitude, $scope.currentPosition.longitude);
                    $scope.map.setCenter(position);
                    $scope.map.setZoom(11);
                });
            }
        });

        $scope.focusOnPosition = function (key, index) {
            if ($scope.geoServicesEnabled) {
                var suggestionRadius = settings.readSetting("suggestionRadius", 100);
                var markerPosition = $scope.newTypeahead[key].positions[index];
                var position = new google.maps.LatLng(markerPosition.latitude, markerPosition.longitude);
                if ($scope.positionMarker === undefined) {
                    $scope.positionMarker = new google.maps.Marker({
                        position: position,
                        map: $scope.map,
                        title: key
                    });
                    var radiusOptions = {
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.6,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.15,
                        map: $scope.map,
                        center: position,
                        radius: suggestionRadius
                    };
                    $scope.positionRadius = new google.maps.Circle(radiusOptions);
                    $scope.map.setCenter(position);
                    $scope.map.setZoom(16);
                } else {
                    $scope.map.setCenter(position);
                    $scope.map.setZoom(16);
                    $scope.positionMarker.setPosition(position);
                    $scope.positionRadius.setCenter(position);
                    $scope.positionRadius.setRadius(suggestionRadius);
                }
            }
        };

        $scope.moveUpPosition = function (key, index) {
            if (index > 0) {
                $scope.newTypeahead[key].positions.swapItems(index, index - 1);
            }
        };

        $scope.moveDownPosition = function (key, index) {
            if (index < ($scope.newTypeahead[key].position.length - 1)) {
                $scope.newTypeahead[key].positions.swapItems(index, index + 1);
            }
        };

        $scope.removePosition = function (key, index) {
            if (confirm("Are you sure?")) {
                $scope.newTypeahead[key].positions.splice(index, 1);
            }
        };

        $scope.addPosition = function (key) {
            if ($scope.newTypeahead[key].positions === undefined) {
                $scope.newTypeahead[key].positions = [];
            }
            $scope.newTypeahead[key].positions.push({
                latitude: $scope.currentPosition.latitude,
                longitude: $scope.currentPosition.longitude
            });
        };
    }
]);