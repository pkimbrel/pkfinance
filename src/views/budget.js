pkfinance.controller('Budget', ['$scope', '$state', '$q', 'validators', 'dataAccessor', 'applicationScope',
    function ($scope, $state, $q, validators, dataAccessor, applicationScope) {
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

        $scope.validateAndUpdate = function (parentCategory, category, data) {
            var value = data;

            var promise = validationBindings.amount(value, $q).then(function () {
                value = data * 100;
                return dataAccessor.updateBudget(applicationScope.payPeriod, category, value, parentCategory).then(function () {
                    applicationScope.budget[parentCategory][category] = value;
                    updateIncome();
                    updateSpending();
                });
            });

            return promise;
        };

        $scope.filterItems = function (filterData) {
            applicationScope.searchFilter = "category:" + filterData;
            $state.transitionTo("register");
        };
        
        $scope.copyPreviousBudget = function() {
            var payPeriodIndex = applicationScope.availablePayPeriods.indexOf(applicationScope.payPeriod);
            var previousPayPeriod = applicationScope.availablePayPeriods[payPeriodIndex - 1];
            dataAccessor.readBudget(previousPayPeriod).then(function (data) {
                dataAccessor.writeBudget(applicationScope.payPeriod, data).then(function () {
                    applicationScope.updateApplicationScope();
                });
            }).catch(function() {
                alert("Unable to read previous budget");
            });
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

                        var used = amount;
                        angular.forEach(applicationScope.transactions, function (transaction) {
                            if (transaction.category == "Split") {
                                angular.forEach(transaction.categories, function (splitItem) {
                                    if (splitItem.category == child.text) {
                                        used -= splitItem.amount * ((transaction.type == "Credit") ? -1 : 1);
                                    }
                                });
                            } else {
                                if (transaction.category == child.text) {
                                    used -= transaction.amount * ((transaction.type == "Credit") ? -1 : 1);
                                }
                            }
                        });
                        total += amount;
                        children.push({
                            "name": child.text,
                            "amount": (amount / 100).toFixed(2),
                            "used": (used / 100).toFixed(2)
                        });
                    });
                    
                    $scope.spending.push({
                        "name": category.text,
                        "percentage": total / applicationScope.totalIncome(),
                        "icon": category.icon,
                        "children": children,
                        "amount": (total / 100).toFixed(2)
                    });
                }
            });
        }
    }
]);