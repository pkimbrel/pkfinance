/**
 * Created by pkimbrel on 4/10/14.
 */

/* global angular */
var pkfinance = angular.module("pkfinance", ["ui.router", "xeditable"])
    .constant("DATA_FOLDER", "../test/data/")
    .constant("DIST_FOLDER", "../src/")
    .constant("START_DATE", "2013-01-11")
    .constant("HOME", {
        "latitude": 40.313215,
        longitude: -105.648299
    }).constant("CURRENT_POSITION", {
        "latitude": 40.303634,
        longitude: -105.637974
    })
    .value("debug", false);