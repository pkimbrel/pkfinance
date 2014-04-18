/**
 * Created by pkimbrel on 3/26/14.
 */

/* global $, angular, setTimeout */


pkfinance.run(['$http', '$rootScope', '$state', 'authService', 'editableOptions',
    function ($http, $rootScope, $state, authService, editableOptions) {
        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (toState.authenticate) {
                authService.isAuthenticated().
                catch (function (reason) {
                    $state.transitionTo("login");
                });
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

pkfinance.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state("summary", {
                url: "/",
                templateUrl: "pages/displaySummary.html",
                controller: "DisplaySummary",
                authenticate: true
            })
            .state("register", {
                url: "/register",
                templateUrl: "pages/displayRegister.html",
                controller: "DisplayRegister",
                authenticate: true
            })
            .state("budget", {
                url: "/budget",
                templateUrl: "pages/displayBudget.html",
                controller: "DisplayBudget",
                authenticate: true
            })
            .state("planner", {
                url: "/planner",
                templateUrl: "pages/displayPlanner.html",
                controller: "DisplayPlanner",
                authenticate: true
            })
            .state("newTransaction", {
                url: "/newTransaction",
                templateUrl: "pages/displayNewTransaction.html",
                controller: "DisplayNewTransaction",
                authenticate: true
            })
            .state("login", {
                url: "/login",
                templateUrl: "pages/displayLogin.html",
                controller: "DisplayLogin",
                authenticate: false
            });
        // Send to login if the URL was not found
        $urlRouterProvider.otherwise("/register");
    }
]);
