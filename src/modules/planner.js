pkfinance.controller('Planner', ['$scope', '$q', 'validators', 'dataAccessor', 'applicationScope',
    function ($scope, $q, validators, dataAccessor, applicationScope) {
        $scope.app = applicationScope;

        $scope.week1 = {};
        $scope.week2 = {};

        $scope.$watch("app.planner", function (planner) {
            angular.forEach(applicationScope.planner.income, function (event) {
                switch (event.type) {
                case "week":
                    var day = Number(event.day);
                    var displayEvent = {
                        date: eventDate.toDate(),
                        name: event.category,
                        displayAmount: (event.amoun / 100).fixed(2)
                    };

                    var eventDate = moment(applicationScope.startDate).add(day);
                    if (event.day < 14) {
                        week1.push(displayEvent);
                    } else {
                        week2.push(displayEvent);
                    }
                    break;
                }
            });
        });
    }
]);
