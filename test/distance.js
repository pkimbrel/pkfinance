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
    var lat1 = (40.4963827).toRad();
    var lon1 = (-88.9359495).toRad();

    var lat2 = (40.511760).toRad();
    var lon2 = (-88.946668).toRad();

    $scope.startLatitude = lat1;
    $scope.startLongitude = lon1;

    $scope.finalLatitude = lat2;
    $scope.finalLongitude = lon2;

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

});
