/**
 * Created by pkimbrel on 4/10/14.
 */

/* global angular */
var pkfinance = angular.module("pkfinance", ["ui.router", "xeditable"])
    .constant("DATA_FOLDER", "http://development.paulkimbrel.net/pkf-srv/service/")
    .constant("DIST_FOLDER", "../src/")
    .constant("START_DATE", "2013-01-11")
    .value("debug", false);