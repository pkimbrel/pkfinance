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

    $scope.startPosition = "40.4963827,-88.9359495";
    $scope.finalPosition = "40.511760,-88.946668";

    $scope.updateDistance = function () {
        var splitStart = $scope.startPosition.split(",");
        var finalStart = $scope.finalPosition.split(",");
        var lat1 = Number(splitStart[0]).toRad();
        var lon1 = Number(splitStart[1]).toRad();

        var lat2 = Number(finalStart[0]).toRad();
        var lon2 = Number(finalStart[1]).toRad();

        var R = 6371; // km
        var dLat = (lat2 - lat1);
        var dLon = (lon2 - lon1);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        $scope.rawDistance = (dLat * dLat + dLon * dLon) * 500000;
        $scope.distance = (R * c).toFixed(3);

        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) -
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        $scope.bearing = Math.atan2(y, x).toDeg();
    };

    $scope.updateDistance();

});
