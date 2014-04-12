pkfinance.controller('TransactionForm', ['$scope', '$q', 'validators', 'dataAccessor', 'applicationScope',
    function ($scope, $q, validators, dataAccessor, applicationScope) {
        $scope.app = applicationScope;
        $scope.newTransaction = {
            "payPeriod": applicationScope.payPeriod,
            "date": moment().format('YYYY-MM-DD'),
            "description": "",
            "category": null,
            "type": "Debit",
            "cleared": false,
            "amount": ""
        };
        $scope.submit = function () {
            console.log("here");
        };
    }
]);
