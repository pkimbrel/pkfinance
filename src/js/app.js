/**
 * Created by pkimbrel on 3/26/14.
 */

/* global $, angular, setTimeout */


pkfinance.run(['$http', '$rootScope', '$state', 'authService', 'editableOptions',
    function ($http, $rootScope, $state, authService, editableOptions) {
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

        $rootScope.isAuthenticated = false;
        
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate) {
                if (!$rootScope.isAuthenticated) {
                    authService.isAuthenticated().then(function () {
                        $rootScope.isAuthenticated = true;
                    }).catch (function (reason) {
                        $state.transitionTo("login");
                    });
                }
            }
        });

        $rootScope.$on("$stateChangeSuccess", function (event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate) {
                setTimeout(function () {
                    $('.sidebar').affix();
                }, 200);
            }

            if (fromState.name === "") {
                $rootScope.previousState = "register";
            } else {
                $rootScope.previousState = fromState.name;
            }
        });

        editableOptions.theme = 'bs3';
    }
]);

pkfinance.config(['$stateProvider', '$urlRouterProvider', 'DIST_FOLDER',
    function ($stateProvider, $urlRouterProvider, DIST_FOLDER) {
        $stateProvider
            .state("summary", {
                url: "/",
                templateUrl: DIST_FOLDER + "pages/displaySummary.html",
                controller: "DisplaySummary",
                authenticate: true
            })
            .state("register", {
                url: "/register",
                templateUrl: DIST_FOLDER + "pages/displayRegister.html",
                controller: "DisplayRegister",
                authenticate: true
            })
            .state("budget", {
                url: "/budget",
                templateUrl: DIST_FOLDER + "pages/displayBudget.html",
                controller: "DisplayBudget",
                authenticate: true
            })
            .state("planner", {
                url: "/planner",
                templateUrl: DIST_FOLDER + "pages/displayPlanner.html",
                controller: "DisplayPlanner",
                authenticate: true
            })
            .state("newTransaction", {
                url: "/newTransaction",
                templateUrl: DIST_FOLDER + "pages/displayNewTransaction.html",
                controller: "DisplayNewTransaction",
                authenticate: true
            })
            .state("login", {
                url: "/login",
                templateUrl: DIST_FOLDER + "pages/displayLogin.html",
                controller: "DisplayLogin",
                authenticate: false
            });
        // Send to login if the URL was not found
        $urlRouterProvider.otherwise("/register");
    }
]);
