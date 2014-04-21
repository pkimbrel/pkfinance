if (typeof Number.prototype.toRad == 'undefined') {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    };
}

if (typeof Number.prototype.toDeg == 'undefined') {
    Number.prototype.toDeg = function () {
        return this * 180 / Math.PI;
    };
}

var pkfinance = angular.module("location", []);

pkfinance.run(function () {});

pkfinance.controller('geo', function ($scope, $interval) {
    $scope.latitude = "-";
    $scope.longitude = "-";

    $scope.startLatitude = "-";
    $scope.startLongitude = "-";

    $scope.showPosition = function (position) {
        $scope.latitude = position.coords.latitude;
        $scope.longitude = position.coords.longitude;

        if ($scope.startLatitude !== "-") {
            var lat1 = ($scope.startLatitude).toRad();
            var lon1 = ($scope.startLongitude).toRad();

            var lat2 = ($scope.latitude).toRad();
            var lon2 = ($scope.longitude).toRad();

            var R = 6371; // km
            var dLat = (lat2 - lat1);
            var dLon = (lon2 - lon1);

            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            $scope.distance = (R * c).toFixed(3);

            var y = Math.sin(dLon) * Math.cos(lat2);
            var x = Math.cos(lat1) * Math.sin(lat2) -
                Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
            $scope.bearing = Math.atan2(y, x).toDeg();

        } else {
            $scope.startLatitude = $scope.latitude;
            $scope.startLongitude = $scope.longitude;
        }
        $scope.$apply();
    };

    $scope.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
        } else {
            $scope.error = "Geolocation is not supported by this browser.";
        }
    };

    $interval(function () {
        $scope.getLocation();
    }, 1000);
});
