pkfinance.controller('Planner', ['$scope', '$q', 'validators', 'dataAccessor', 'applicationScope',
    function ($scope, $q, validators, dataAccessor, applicationScope) {
        $scope.app = applicationScope;

        $scope.week1 = [];
        $scope.week2 = [];
        $scope.week1Total = 0;
        $scope.week2Total = 0;
        $scope.unused = [];
        $scope.discretionaryIncome = 0;

        $scope.order = ["date", "direction"];

        $scope.$watch('app.planner', function (planner, oldValue) {
            if (planner !== undefined) {
                $scope.week1 = [];
                $scope.week2 = [];
                $scope.week1Total = 0;
                $scope.week2Total = 0;

                var unused = [];
                angular.copy(planner, unused);

                angular.forEach(planner.bills, function (event) {
                    if (processEvent(event, false)) {
                        var removeIndex = -1;
                        angular.forEach(unused.bills, function (unusedEvent, index) {
                            if (unusedEvent.category == event.category) {
                                removeIndex = index;
                            }
                        });
                        if (removeIndex > -1) {
                            unused.bills.splice(removeIndex, 1);
                        }
                    }
                });
                angular.forEach(planner.income, function (event) {
                    processEvent(event, true);
                });

                $scope.week1.push({
                    category: "Total for Week 1",
                    direction: "boo",
                    type: "boo",
                    amount: $scope.week1Total
                });

                $scope.week2.push({
                    category: "Total for Week 2",
                    direction: "boo",
                    type: "boo",
                    amount: $scope.week2Total
                });

                $scope.unused = unused;
            }
        });

        function processEvent(event, isCredit) {
            var processed = false;
            var relativeDay = 0;

            var displayEvent = {
                category: event.category,
                direction: ((isCredit) ? "Credit" : "Debit"),
                type: event.type,
                amount: event.amount
            };

            switch (event.type) {
            case "week":
                var weekDay = Number(event.day);
                displayEvent.date = moment(applicationScope.startDate).add('days', weekDay).toDate();
                relativeDay = weekDay;
                break;

            case "month":
                var monthDay = Number(event.day);

                var calcDate = moment(applicationScope.startDate);
                for (var i = 0; i < 28; i++) {
                    if (calcDate.date() == monthDay) {
                        displayEvent.date = moment(calcDate).toDate();
                    }
                    calcDate.add("days", 1);
                }
                relativeDay = moment(displayEvent.date).diff(moment(applicationScope.startDate), 'days');
                break;
            }

            if (displayEvent.date !== undefined) {
                processed = true;
                displayEvent.past = moment().toDate() > displayEvent.date;

                if (relativeDay < 14) {
                    $scope.week1.push(displayEvent);
                    $scope.week1Total += displayEvent.amount * ((isCredit) ? 1 : -1);
                } else {
                    $scope.week2.push(displayEvent);
                    $scope.week2Total += displayEvent.amount * ((isCredit) ? 1 : -1);
                }
            }
            return processed;
        }
    }
]);
