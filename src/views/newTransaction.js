pkfinance.controller('TransactionForm', ['$rootScope', '$scope', '$state', '$q', 'validators', 'dataAccessor', 'applicationScope',
    function ($rootScope, $scope, $state, $q, validators, dataAccessor, applicationScope) {
        function guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
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

        $scope.submit = function () {
            $scope.isUpdating = true;
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
                if (/^\d+(?:\.\d{0,2}){0,1}$/.test(viewValue)) {
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
