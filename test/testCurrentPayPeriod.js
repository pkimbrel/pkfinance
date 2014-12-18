var moment = require('moment');

function calculateCurrentPayPeriod(currentDate) {
    var startDateSetting = "2013-01-11";
    var startDate = moment(startDateSetting);
    var periodsSinceStart = Math.floor(((currentDate.diff(startDate, 'days')) / 28)) + 1;
    console.log("PDK: " + periodsSinceStart);
    var yearsSinceStart = Math.floor((periodsSinceStart-1) / 13);
    console.log("PDK: " + yearsSinceStart);
    var payPeriodInYear = periodsSinceStart - (yearsSinceStart * 13);
    console.log("PDK: " + payPeriodInYear);
    var year = startDate.year() + yearsSinceStart;
    payPeriod = year + "-" + ((payPeriodInYear < 10) ? "0" : "") + payPeriodInYear;
    return payPeriod;
};

var testCases = {
    "test1301a" : {
        "expected": "2013-01",
        "actual": function() {
            return calculateCurrentPayPeriod(moment("01-11-2013"))
        }
    },
    "test1301b" : {
        "expected": "2013-01",
        "actual": function() {
            return calculateCurrentPayPeriod(moment("01-11-2013"))
        }
    },
    "test1302" : {
        "expected": "2013-02",
        "actual": function() {
            return calculateCurrentPayPeriod(moment("02-08-2013"))
        }
    },
    "test1307" : {
        "expected": "2013-07",
        "actual": function() {
            return calculateCurrentPayPeriod(moment("07-25-2013"))
        }
    },
    "test1308" : {
        "expected": "2013-08",
        "actual": function() {
            return calculateCurrentPayPeriod(moment("07-26-2013"))
        }
    },
    "test1312" : {
        "expected": "2013-12",
        "actual": function() {
            return calculateCurrentPayPeriod(moment("12-12-2013"))
        }
    },
    "test1313" : {
        "expected": "2013-13",
        "actual": function() {
            return calculateCurrentPayPeriod(moment("12-13-2013"))
        }
    }
};

for (var testCase in testCases) {
    var actual = testCases[testCase].actual();
    var expected = testCases[testCase].expected;
    if (actual === expected ){
        console.log(testCase + ": PASSED");
    } else {
        console.log(testCase + ": FAILED (expected: \"" + expected + "\", actual: \"" + actual + "\")");
    }
}
