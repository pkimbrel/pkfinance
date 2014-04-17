/**
 * Created by pkimbrel on 4/10/14.
 */

/* global angular */
var pkfinance = angular.module("pkfinance", ["ngCookies", "ui.router", "xeditable"])
    .constant("DATA_FOLDER", "data")
    .constant("START_DATE", "2013-01-11")
    .value("debug", false);
