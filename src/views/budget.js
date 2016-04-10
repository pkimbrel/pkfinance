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

        $scope.resetBudget = function () {
            var ok = confirm("Did you seriously just click that?\nI specifically said, \"DON'T CLICK THIS.\"\n\nI worry about you sometimes.\n\nHere's the deal:\nThis button will reset THIS budget to last month's values.\n\nHandy if you want to start over.\nTerrible if you've spent hours working on this budget.\n\nDo you REALLY want to do this?!\n\nChoose wisely.");
            if (ok) {
                $scope.copyPreviousBudget();
            }
        };

        $scope.validateAndUpdate = function (parentCategory, category, data) {
            var value = data;

            var promise = validationBindings.amount(value, $q).then(function () {
                value = data * 100;
                return dataAccessor.updateBudget(applicationScope.account, applicationScope.payPeriod, category, value, parentCategory).then(function () {
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

        $scope.equalizeBudget = function (budgetItem) {
            console.log();
            $scope.validateAndUpdate('spending', budgetItem.name, (Number(budgetItem.amount) - budgetItem.left).toFixed(2));
        }

        $scope.balanceBudget = function (budgetItem) {
            $scope.validateAndUpdate('spending', budgetItem.name, (Number(budgetItem.amount) + applicationScope.difference()/100).toFixed(2));
        }

        $scope.copyPreviousBudget = function () {
            var payPeriodIndex = applicationScope.availablePayPeriods.indexOf(applicationScope.payPeriod);
            var previousPayPeriod = applicationScope.availablePayPeriods[payPeriodIndex - 1];
            dataAccessor.readBudget(applicationScope.account, previousPayPeriod).then(function (data) {
                dataAccessor.writeBudget(applicationScope.account, applicationScope.payPeriod, data).then(function () {
                    applicationScope.updateApplicationScope();
                });
            }).
            catch (function () {
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
                        if (applicationScope.budget.income[budgetItem] !== undefined) {
                            amount = applicationScope.budget.income[budgetItem];
                        }

                        $scope.income.push({
                            "name": budgetItem,
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
            
            var remaining = 0;

            angular.forEach(applicationScope.categories, function (category) {
                if (category.text != "Income") {
                    var children = [];
                    var total = 0;

                    angular.forEach(category.children, function (child) {
                        var amount = 0;
                        if (applicationScope.budget.spending[child] !== undefined) {
                            amount = Number(applicationScope.budget.spending[child]);
                        }

                        var left = amount;
                        angular.forEach(applicationScope.transactions, function (transaction) {
                            if (transaction.category == "Split") {
                                angular.forEach(transaction.categories, function (splitItem) {
                                    if (splitItem.category == child) {
                                        left -= splitItem.amount * ((transaction.type == "Credit") ? -1 : 1);
                                    }
                                });
                            } else {
                                if (transaction.category == child) {
                                    left -= transaction.amount * ((transaction.type == "Credit") ? -1 : 1);
                                }
                            }
                        });
                        total += amount;
                        remaining += left;
                        children.push({
                            "name": child,
                            "amount": (amount / 100).toFixed(2),
                            "left": (left / 100).toFixed(2)
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
                
                $scope.remaining = (remaining/100).toFixed(2);
                $scope.trueRemaining = ((applicationScope.endingBalance(false) - remaining - 50000)/100).toFixed(2);
            });
        }
    }
]);
