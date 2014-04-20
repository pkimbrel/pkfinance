var pkfinance = angular.module("location", []);

pkfinance.run(function () {});

pkfinance.controller('geo', function ($scope, $interval) {
    $scope.latitude = "-";
    $scope.longitude = "-";

    $scope.showPosition = function (position) {
        $scope.latitude = position.coords.latitude;
        $scope.longitude = position.coords.longitude;
        $scope.$apply();
    }

    $scope.getLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
        } else {
            $scope.error = "Geolocation is not supported by this browser.";
        }
    }

    $interval(function () {
        $scope.getLocation();
    }, 1000);
});
