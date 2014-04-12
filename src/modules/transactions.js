pkfinance.controller('Transactions', ['$scope', '$q', 'validators', 'dataAccessor', 'applicationScope',
    function ($scope, $q, validators, dataAccessor, applicationScope) {
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

        $scope.validateAndUpdate = function (field, data, id) {
            var promise = validationBindings[field](data, $q).then(function () {
                return dataAccessor.updateCheckbook(field, data, id, $q);
            });
            return promise;
        };

    }
]);
