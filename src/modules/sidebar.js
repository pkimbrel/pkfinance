pkfinance.controller('Sidebar', ['$scope', 'applicationScope', 'dataAccessor',
    function ($scope, applicationScope, dataAccessor) {
        $scope.app = applicationScope;
        $scope.clear = function () {
            applicationScope.searchFilter = "";
        };
        
        $scope.refreshStartingBalance = function() {
            var payPeriodIndex = applicationScope.availablePayPeriods.indexOf(applicationScope.payPeriod);
            var previousPayPeriod = applicationScope.availablePayPeriods[payPeriodIndex - 1];
            dataAccessor.readCheckbook(previousPayPeriod).then(function (data) {
                var balance = data.startingBalance;
                angular.forEach(data.transactions, function (transaction) {
                    var amount = transaction.amount * ((transaction.type == "Debit") ? -1 : 1);
                    balance += amount;
                });
                dataAccessor.updateTransaction(applicationScope.payPeriod, "root", "startingBalance", balance).then(function() {
                    applicationScope.updateApplicationScope();
                });
            }).catch(function() {
                alert("Unable to read previous budget");
            });
        };
    }
]);
