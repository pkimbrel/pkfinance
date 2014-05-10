pkfinance.controller('TransactionForm', ['$rootScope', '$scope', '$state', '$q', 'validators', 'dataAccessor', 'applicationScope', 'settings', 'geoServices',
    function ($rootScope, $scope, $state, $q, validators, dataAccessor, applicationScope, settings, geoServices) {
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
                function searchEntry(description, entry, suggestions, suggestionRadius) {
                    for (var index in entry.positions) {
                        var distance = geoServices.calculateDistance($scope.currentPosition, entry.positions[index]);
                        if (distance < suggestionRadius) {
                            suggestions.push({
                                "description": description,
                                "category": entry.category,
                                "type": entry.type,
                                "distance": distance
                            });
                        }
                    }

                }

                function searchTypeaheadData() {
                    var suggestions = [];
                    var suggestionRadius = Number(settings.readSetting("suggestionRadius", 25));

                    for (var description in typeaheadData) {
                        var entry = typeaheadData[description];
                        if (entry.positions !== undefined) {
                            searchEntry(description, entry, suggestions, suggestionRadius);
                        }
                    }

                    return suggestions;
                }

                function buildSuggestions() {
                    var suggestions = [];
                    if (!geoServices.isBlackedOut($scope.currentPosition)) {
                        suggestions = searchTypeaheadData();

                        suggestions.sort(function (a, b) {
                            return a.distance - b.distance;
                        });
                    }
                    return suggestions;
                }

                dataAccessor.getPosition().then(function (currentPosition) {
                    $scope.currentPosition = currentPosition;
                    $scope.suggestions = buildSuggestions();
                });

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
            "payPeriod": applicationScope.payPeriod,
            "description": null,
            "date": moment().format('YYYY-MM-DD'),
            "amount": null,
            "type": "Debit",
            "cleared": false,
            "category": null
        };

        $scope.splits = [{
            "category": null,
            "amount": $scope.newTransaction.amount
        }];

        $scope.$watch('$viewContentLoaded', loadTypeahead);

        $scope.suggest = function (suggestion) {
            $scope.newTransaction.description = suggestion.description;
            $scope.newTransaction.category = suggestion.category;
            $scope.newTransaction.type = suggestion.type;
            $scope.suggestions = null;
        };

        /**
         * THIS IS THE MONEY
         */
        $scope.submit = function () {
            $scope.isUpdating = true;
            var finalTransaction = {
                "tranid": guid(),
                "description": $scope.newTransaction.description,
                "date": $scope.newTransaction.date,
                "amount": $scope.newTransaction.amount * 100,
                "type": $scope.newTransaction.type,
                "cleared": $scope.newTransaction.cleared,
                "category": $scope.newTransaction.category
            };
            
            if (finalTransaction.category == "Split") {
                finalTransaction.categories = angular.copy($scope.splits);
                angular.forEach(finalTransaction.categories, function (split) {
                    split.amount *= 100;
                });
            }

            dataAccessor.newTransaction($scope.newTransaction.payPeriod, finalTransaction.tranid, finalTransaction).then(function() {
                applicationScope.payPeriod = $scope.newTransaction.payPeriod;
                finalTransaction.displayAmount = (finalTransaction.amount / 100).toFixed(2);
                applicationScope.transactions.push(finalTransaction);
                $state.transitionTo("register");
            });
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
}]);

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
