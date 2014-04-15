pkfinance.controller('Budget', ['$scope', '$q', 'validators', 'dataAccessor', 'applicationScope',
    function ($scope, $q, validators, dataAccessor, applicationScope) {
        var validationBindings = {
            "amount": validators.validateCurrency
        };

        $scope.app = applicationScope;

        $scope.$watch(
            "app.budget", function () {
                updateIncome();
                updateSpending();
            });

        $scope.$watch(
            "app.transactions", function () {
                updateIncome();
                updateSpending();
            });

        $scope.validateAndUpdate = function (field, data) {
            var value = data;

            var promise = validationBindings[field](value, $q).then(function () {
                if (field == "amount") {
                    value = data * 100;
                }
                return dataAccessor.updateBudget(field, value, $q);
            });
            return promise;
        };

        function updateIncome() {
            $scope.income = [];

            if (applicationScope.categories === undefined || applicationScope.budget === undefined) {
                return;
            }
            angular.forEach(applicationScope.categories, function (category) {
                if (category.text == "Income") {
                    angular.forEach(category.children, function (budgetItem) {
                        var amount = 0;
                        if (applicationScope.budget.income[budgetItem.text] !== undefined) {
                            amount = applicationScope.budget.income[budgetItem.text];
                        }

                        $scope.income.push({
                            "name": budgetItem.text,
                            "amount": (amount / 100).toFixed(2)
                        });
                    });
                }
            });
        }

        function updateSpending() {
            $scope.spending = [];

            if (applicationScope.categories === undefined || applicationScope.budget === undefined) {
                return;
            }

            angular.forEach(applicationScope.categories, function (category) {
                if (category.text != "Income") {
                    var children = [];
                    var total = 0;

                    angular.forEach(category.children, function (child) {
                        var amount = 0;
                        if (applicationScope.budget.spending[child.text] !== undefined) {
                            amount = Number(applicationScope.budget.spending[child.text]);
                        }
                        total += amount;
                        children.push({
                            "name": child.text,
                            "amount": amount
                        });
                    });

                    $scope.spending.push({
                        "name": category.text,
                        "percentage": total / applicationScope.totalIncome,
                        "icon": category.icon,
                        "children": children,
                        "amount": total
                    });
                }
            });
        }
    }
]);
