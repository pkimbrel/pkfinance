/**
 * Modules
 */
/* global pkfinance, angular, localStorage */
pkfinance.controller('Header', function ($scope, $state) {
    $scope.logout = function () {
        localStorage.removeItem("token");
        $state.go("login");
    };
});

pkfinance.controller('Sidebar', function ($scope, applicationScope) {
    $scope.app = applicationScope;
});

pkfinance.controller('Transactions', function ($scope, $q, validators, dataAccessor, applicationScope) {
    var validationBindings = {
        "date": validators.validateDate,
        "amount": validators.validateCurrency,
        "description": validators.skipValidation,
        "category": validators.skipValidation,
        "type": validators.skipValidation,
        "cleared": validators.skipValidation
    };

    $scope.app = applicationScope;

    $scope.order = ["cleared", "-date"];
    $scope.type = ["Debit", "Credit"];

    $scope.validateAndUpdate = function (field, data, id) {
        var promise = validationBindings[field](data, $q).then(function () {
            return dataAccessor.updateCheckbook(field, data, id, $q);
        });
        return promise;
    };

    $scope.flattenCategories = function () {
        var list = [];
        angular.forEach($scope.categories, function (group) {
            angular.forEach(group.children, function (category) {
                list.push({
                    "category": category.text,
                    "group": group.text
                });
            });
        });
        return list;
    };
});
