/**
 * Created by pkimbrel on 4/10/14.
 */

/* global angular */
var pkfinance = angular.module("pkfinance", ["ui.router", "xeditable", "ngAnimate"])
    .constant("DATA_FOLDER", "../src/php/service/")
    .constant("DIST_FOLDER", "../src/")
    .value("debug", false);