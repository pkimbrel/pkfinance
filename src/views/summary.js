pkfinance.controller('Summary', ['$scope', '$q', '$state', 'validators', 'settings', 'dataAccessor', 'applicationScope',
    function ($scope, $q, $state, validators, settings, dataAccessor, applicationScope) {
        $scope.app = applicationScope;

        $scope.settings = settings.readAllSettings;

        $scope.filterItems = function (filterData) {
            applicationScope.searchFilter = "category:" + filterData;
            $state.transitionTo("register");
        };

        $scope.$watchCollection("[settings, app.budget, app.transactions]", function (newValues, oldValues, scope) {
            var newSettings = newValues[0]();
            var budget = newValues[1];
            var transactions = newValues[2];

            if ((newSettings !== undefined) && (budget !== undefined) && (transactions !== undefined)) {
                var summaryCategories = newSettings.summaryCategories;
                $scope.summary = [];

                angular.forEach(summaryCategories, function (category) {
                    var budgetedAmount = budget.spending[category];
                    if (budgetedAmount === undefined) {
                        budgetedAmount = 0;
                    }

                    var remaining = budgetedAmount;

                    angular.forEach(applicationScope.transactions, function (transaction) {
                        if (transaction.category == "Split") {
                            angular.forEach(transaction.categories, function (splitItem) {
                                if (splitItem.category == category) {
                                    remaining -= splitItem.amount * ((transaction.type == "Credit") ? -1 : 1);
                                }
                            });
                        } else {
                            if (transaction.category == category) {
                                remaining -= transaction.amount * ((transaction.type == "Credit") ? -1 : 1);
                            }
                        }
                    });

                    var percentage = ((remaining / budgetedAmount) * 100).toFixed(0);
                    var displayClass = "success";
                    if (percentage < 10) {
                        displayClass = "danger";
                    } else if (percentage < 30) {
                        displayClass = "warning";
                    }
                    $scope.summary.push({
                        "category": category,
                        "budgetedAmount": (budgetedAmount / 100).toFixed(2),
                        "remaining": (remaining / 100).toFixed(2),
                        "percentage": percentage,
                        "displayClass": displayClass
                    });
                });
            }
        });
}]);