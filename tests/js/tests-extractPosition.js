/* eslint-env node */
"use strict";
var fluid = require("infusion");

var jqUnit = require("node-jqunit");

require("../../src/mdjson-linter");

fluid.registerNamespace("fluid.tests.mdjsonLinter.extractPosition");

fluid.tests.mdjsonLinter.extractPosition.runAllTests = function (that) {
    fluid.each(that.options.testDefs, fluid.tests.mdjsonLinter.extractPosition.runSingleTest);
};

fluid.tests.mdjsonLinter.extractPosition.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var posDef = fluid.mdjsonLinter.extractPosition(testDef.errorString, testDef.originalMaterial);
        jqUnit.assertDeepEq("The output should be as expected...", testDef.expected, posDef);
    });
};

fluid.defaults("fluid.tests.mdjsonLinter.extractPosition.testRunner", {
    gradeNames: ["fluid.component"],
    testDefs: {
        firstLineFirstColumn: {
            message: "We should be able to handle position 0...",
            errorString: "at position 0",
            originalMaterial: "This is a multi-line string.\nSee!\n",
            expected: {
                line:     1,
                column:   1,
                position: 0
            }
        },
        firstLineIntermediateColumn: {
            message: "We should be able to handle a non-zero position that's still on the first line...",
            errorString: "at position 5",
            originalMaterial: "This is a multi-line string.\nSee!\n",
            expected: {
                line:     1,
                column:   6,
                position: 5
            }
        },
        secondLine: {
            message: "We should be able to handle position that hits a later line...",
            errorString: "at position 22",
            originalMaterial: "123456789\n123456789\n123456789", // every tenth character is a carriage return to make the maths easier.
            expected: {
                line:     3,
                column:   3,
                position: 22
            }
        },
        bogusString: {
            message: "We should be able to handle a string that does not match our pattern...",
            errorString: "random gibberish that isn't helpful",
            originalMaterial: "",
            expected: {
                line: 0,
                column: 0,
                position: 0
            }
        }
    },
    listeners: {
        "onCreate.setModule": {
            funcName: "jqUnit.module",
            args:     ["Unit tests for the position extraction function..."]
        },
        "onCreate.runTests": {
            funcName: "fluid.tests.mdjsonLinter.extractPosition.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.tests.mdjsonLinter.extractPosition.testRunner();
