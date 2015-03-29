pkfinance.controller('Sidebar', ['$scope', 'applicationScope', 'dataAccessor',
    function ($scope, applicationScope, dataAccessor) {
        $scope.app = applicationScope;
        $scope.clear = function () {
            applicationScope.searchFilter = "";
        };
        
        $scope.updateStartingBalance = function () {
            var newBalance = null;
            newBalance = prompt("Please enter a new amount", (applicationScope.startingBalance / 100).toFixed(2));
            if (newBalance === null) {
                return;
            }
            
            if (!/^\d+(?:\.\d{0,2}){0,1}$/.test(newBalance)) {
                alert("Given amount was invalid.");
                return;
            }
            
            dataAccessor.updateTransaction(applicationScope.payPeriod, "root", "startingBalance", newBalance * 100).then(function() {
                applicationScope.updateApplicationScope();
            });
        };
        
        $scope.refreshStartingBalance = function() {
            var payPeriodIndex = applicationScope.availablePayPeriods.indexOf(applicationScope.payPeriod);
            var previousPayPeriod = applicationScope.availablePayPeriods[payPeriodIndex - 1];
            dataAccessor.readCheckbook(previousPayPeriod).then(function (data) {
                var balance = data.startingBalance;
                var unreconciledAmount = 0;
                angular.forEach(data.transactions, function (transaction) {
                    var amount = transaction.amount * ((transaction.type == "Debit") ? -1 : 1);
                    balance += amount;
                    if (!transaction.cleared) {
                        unreconciledAmount -= amount;
                    }
                });
                if (balance > 0) {
                    dataAccessor.updateTransaction(applicationScope.payPeriod, "root", "unreconciledAmount", unreconciledAmount).then(function() {
                        dataAccessor.updateTransaction(applicationScope.payPeriod, "root", "startingBalance", balance).then(function() {
                            applicationScope.updateApplicationScope();
                        });
                    });
                }
            }).catch(function() {
                alert("Unable to read previous budget");
            });
        };
        
        $scope.goToPreviousPayPeriod = function() {
            var payPeriodIndex = applicationScope.availablePayPeriods.indexOf(applicationScope.payPeriod);
            if (payPeriodIndex > 0) {
                applicationScope.payPeriod = applicationScope.availablePayPeriods[payPeriodIndex - 1];
                applicationScope.updateApplicationScope();
            }
        };
        
        $scope.goToCurrentPayPeriod = function() {
            applicationScope.payPeriod = applicationScope.calculateCurrentPayPeriod(moment());
            applicationScope.updateApplicationScope();
        };
        
        $scope.goToNextPayPeriod = function() {
            var payPeriodIndex = applicationScope.availablePayPeriods.indexOf(applicationScope.payPeriod);
            if (payPeriodIndex < (applicationScope.availablePayPeriods.length + 1)) {
                applicationScope.payPeriod = applicationScope.availablePayPeriods[payPeriodIndex + 1];
                applicationScope.updateApplicationScope();
            }
        };
    }
]);
