pkfinance.controller('Categories', ['$rootScope', '$scope', '$state', '$q', 'validators', 'dataAccessor', 'applicationScope', 'settings', 'geoServices',
    function ($rootScope, $scope, $state, $q, validators, dataAccessor, applicationScope, settings, geoServices) {
        $scope.app = applicationScope;

        $scope.isUpdating = false;
        $scope.isSame = function () {
            return angular.equals($scope.newCategories, applicationScope.categories);
        };

        $scope.submit = function () {
            if (confirm("You may find this annoying, but I want to be ABSOLUTELY certain that you want do this.\n\nChoose wisely.")) {
                $scope.isUpdating = true;
                dataAccessor.updateCategories($scope.newCategories).then(function () {
                    applicationScope.categories = angular.copy($scope.newCategories);
                    applicationScope.updateApplicationScope();
                    $state.transitionTo($rootScope.previousState);
                }).catch(function () {
                    alert("Update failed");
                    $scope.isUpdating = false;
                });
            }
        };

        $scope.cancel = function () {
            $state.transitionTo($rootScope.previousState);
        };

        $scope.$watch("app.categories", function () {
            if (applicationScope.categories !== undefined) {
                $scope.newCategories = angular.copy(applicationScope.categories);
            }
        });

        $scope.moveUpParentCategory = function (index) {
            if (index > 0) {
                $scope.newCategories.swapItems(index, index - 1);
            }
        };

        $scope.moveDownParentCategory = function (index) {
            if (index < ($scope.newCategories.length - 1)) {
                $scope.newCategories.swapItems(index, index + 1);
            }
        };

        $scope.removeParentCategory = function (index) {
            if (confirm("Are you ABSOLUTELY sure?")) {
                $scope.newCategories.splice(index, 1);
            }
        };

        $scope.addParentCategory = function () {
            $scope.newCategories.push({
                "text": "New Parent Category",
                "children": []
            });
        };

        $scope.moveUpCategory = function (parentCategory, index) {
            if (index > 0) {
                angular.forEach($scope.newCategories, function (parentObj) {
                    if (parentObj.text == parentCategory) {
                        parentObj.children.swapItems(index, index - 1);
                    }
                });
            }
        };

        $scope.moveDownCategory = function (parentCategory, index) {
            angular.forEach($scope.newCategories, function (parentObj) {
                if (parentObj.text == parentCategory) {
                    if (index < (parentObj.children.length - 1)) {
                        parentObj.children.swapItems(index, index + 1);
                    }
                }
            });
        };

        $scope.removeCategory = function (parentCategory, index) {
            if (confirm("Are you ABSOLUTELY sure?")) {
                angular.forEach($scope.newCategories, function (parentObj) {
                    if (parentObj.text == parentCategory) {
                        parentObj.children.splice(index, 1);
                    }
                });
            }
        };

        $scope.addCategory = function (parentCategory) {
            angular.forEach($scope.newCategories, function (parentObj) {
                if (parentObj.text == parentCategory) {
                    parentObj.children.push(
                        "New Category"
                    );
                }
            });
        };

        $scope.icons = [
            "asterisk",
            "euro",
            "cloud",
            "envelope",
            "pencil",
            "glass",
            "music",
            "search",
            "star",
            "user",
            "film",
            "ok",
            "remove",
            "signal",
            "cog",
            "trash",
            "home",
            "time",
            "road",
            "inbox",
            "repeat",
            "refresh",
            "list-alt",
            "lock",
            "flag",
            "headphones",
            "tag",
            "book",
            "bookmark",
            "print",
            "camera",
            "map-marker",
            "tint",
            "ban-circle",
            "gift",
            "leaf",
            "fire",
            "eye-open",
            "plane",
            "calendar",
            "comment",
            "magnet",
            "shopping-cart",
            "bullhorn",
            "bell",
            "thumbs-up",
            "thumbs-down",
            "globe",
            "wrench",
            "briefcase",
            "paperclip",
            "heart-empty",
            "phone",
            "pushpin",
            "usd",
            "send",
            "credit-card",
            "cutlery",
            "earphone",
            "phone-alt",
            "tower",
            "tree-conifer",
            "tree-deciduous"];

    }
]);