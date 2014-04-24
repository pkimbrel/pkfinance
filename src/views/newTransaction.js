pkfinance.controller('TransactionForm', ['$rootScope', '$scope', '$state', '$q', 'validators', 'dataAccessor', 'applicationScope',
    function ($rootScope, $scope, $state, $q, validators, dataAccessor, applicationScope) {
        function guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        function typeaheadMatcher(dataset) {
            return function findMatches(query, callback) {
                var matches = [];
                var compare = new RegExp(query, 'i');
                $.each(dataset, function (key, str) {
                    if (compare.test(key)) {
                        matches.push({
                            value: key
                        });
                    }
                });

                callback(matches);
            };
        }

        function loadTypeahead() {
            dataAccessor.readTypeAhead().then(function (typeaheadData) {
                $('.description').typeahead({
                    hint: false,
                    highlight: true,
                    minLength: 1
                }, {
                    name: 'categories',
                    displayKey: 'value',
                    source: typeaheadMatcher(typeaheadData)
                });

                $('.description').bind('typeahead:selected', function (obj, keyObject) {
                    var key = keyObject.value;
                    if (typeaheadData[key].category !== undefined) {
                        $scope.newTransaction.category = typeaheadData[key].category;
                    }

                    if (typeaheadData[key].type !== undefined) {
                        $scope.newTransaction.type = typeaheadData[key].type;
                    }

                    $scope.$apply();
                });
            });
        }

        $scope.app = applicationScope;
        $scope.newTransaction = {
            "tranId": guid(),
            "payPeriod": applicationScope.payPeriod,
            "date": moment().format('YYYY-MM-DD'),
            "description": null,
            "category": null,
            "type": "Debit",
            "cleared": false,
            "amount": null
        };

        $scope.splits = [{
            "category": null,
            "amount": $scope.newTransaction.amount
        }];

        $scope.$watch('$viewContentLoaded', loadTypeahead);

        $scope.submit = function () {
            $scope.isUpdating = true;
            var finalTransaction = angular.copy($scope.newTransaction);
            if (finalTransaction.category == "Split") {
                finalTransaction.categories = $scope.splits;
            }

            console.log(finalTransaction);
        };

        $scope.change = function () {
            $scope.updateSplits();
        };

        $scope.$watch("newTransaction.amount", function () {
            $scope.updateSplits();
        });

        $scope.updateSplits = function () {
            if (($scope.newTransaction !== undefined) && ($scope.newTransaction.category == "Split")) {
                var remainder = $scope.newTransaction.amount;
                for (var i = 1; i < $scope.splits.length; i++) {
                    remainder -= Number($scope.splits[i].amount);
                }
                $scope.splits[0].amount = remainder;
            }
        };

        $scope.updateSplits();

        $scope.add = function () {
            $scope.splits.push({
                "category": null,
                "amount": null
            });
            $scope.updateSplits();
        };

        $scope.remove = function (index) {
            $scope.splits.splice(index, 1);
            $scope.updateSplits();
        };

        $scope.cancel = function () {
            $state.transitionTo($rootScope.previousState);
        };
    }
]);

pkfinance.directive('validateDate', function (validators) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (moment(viewValue).isValid()) {
                    ctrl.$setValidity('validateDate', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('validateDate', false);
                    return undefined;
                }
            });
        }
    };
});

pkfinance.directive('validateDescription', function (validators) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue !== "") {
                    ctrl.$setValidity('validateDescription', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('validateDescription', false);
                    return undefined;
                }
            });
        }
    };
});

pkfinance.directive('validateAmount', function (validators) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (/^\d+(?:\.\d{0,2}){0,1}$/.test(viewValue) && (Number(viewValue))) {
                    ctrl.$setValidity('validateAmount', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('validateAmount', false);
                    return undefined;
                }
            });
        }
    };
});