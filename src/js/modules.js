/**
 * Controllers
 */
/* global pkfinance, angular, localStorage */
pkfinance.controller('Head', ['$scope', '$state',
    function ($scope, $state) {
        $scope.currentState = function () {
            if (($state.current.name == "newTransaction") ||
                ($state.current.name == "login")){
                return "new";
            } else {
                return "main";
            }
        };
    }
]);

pkfinance.controller('Header', ['$scope', '$state',
    function ($scope, $state) {
        $scope.logout = function () {
            localStorage.removeItem("token");
            $state.go("login");
        };
    }
]);

pkfinance.controller('Sidebar', ['$scope', 'applicationScope',
    function ($scope, applicationScope) {
        $scope.app = applicationScope;
    }
]);

pkfinance.controller('TransactionForm', ['$scope', '$q', 'validators', 'dataAccessor', 'applicationScope',
    function ($scope, $q, validators, dataAccessor, applicationScope) {
        $scope.app = applicationScope;
        $scope.newTransaction = {
            "payPeriod": applicationScope.payPeriod,
            "date": moment().format('YYYY-MM-DD'),
            "description": "",
            "category": "",
            "type": "Debit"
        };
    }
]);

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
