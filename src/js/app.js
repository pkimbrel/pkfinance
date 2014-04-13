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

            if (fromState.name == "") {
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
                templateUrl: "views/summary.html",
                controller: "Summary",
                authenticate: true
            })
            .state("register", {
                url: "/register",
                templateUrl: "views/register.html",
                controller: "Register",
                authenticate: true
            })
            .state("budget", {
                url: "/budget",
                templateUrl: "views/budget.html",
                controller: "Budget",
                authenticate: true
            })
            .state("planner", {
                url: "/planner",
                templateUrl: "views/planner.html",
                controller: "Planner",
                authenticate: true
            })
            .state("newTransaction", {
                url: "/newTransaction",
                templateUrl: "views/newTransaction.html",
                controller: "NewTransaction",
                authenticate: true
            })
            .state("login", {
                url: "/login",
                templateUrl: "views/login.html",
                controller: "Login",
                authenticate: false
            });
        // Send to login if the URL was not found
        $urlRouterProvider.otherwise("/register");
    }
]);