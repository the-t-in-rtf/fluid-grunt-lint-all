"use strict";
var fluid = require("infusion");
require("..");

var gpii = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

var child_process = require("child_process");

jqUnit.module("Tests for GPII grunt lintall plugin.");

fluid.registerNamespace("gpii.tests.grunt.lintall");

gpii.tests.grunt.lintall.runTests = function (testDefs) {
    var cwd = fluid.module.resolvePath("%gpii-grunt-lintall");
    fluid.each(testDefs, function (testDef) {
        jqUnit.test(testDef.message, function () {
            jqUnit.expect(testDef.tasksToCheck.length);
            fluid.each(testDef.tasksToCheck, function (task) {
                var command = ["grunt", "--gruntfile", testDef.gruntFile, task].join(" ");
                try {
                    var result = child_process.execSync(command, { cwd: cwd});
                    if (testDef.shouldBeInvalid) {
                        jqUnit.fail("The task '" + task + "' did not report invalid content.");
                    }
                    else {
                        jqUnit.assert("The task '" + task + "' correctly reported valid content.");
                    }
                }
                catch (error) {
                    if (testDef.shouldBeInvalid) {
                        jqUnit.assert("The task '" + task + "' correctly reported invalid content.");
                    }
                    else {
                        jqUnit.fail("The task '" + task + "' should not have reported invalid content.");
                    }
                }
            })
        });
    });
};

fluid.defaults("gpii.tests.grunt.lintall.runner", {
    gradeNames: ["fluid.component"],
    tasksToCheck: ["eslint:js", "eslint:md", "json5lint", "mdjsonlint", "jsonlint", "markdownlint", "lintall"],
    testDefs: {
        good: {
            message: "Valid content should be reported as valid.",
            gruntFile: "tests-Gruntfile-good.js",
            tasksToCheck: "{gpii.tests.grunt.lintall.runner}.options.tasksToCheck"
        },
        bad: {
            message: "Invalid content should be reported as invalid.",
            gruntFile: "tests-Gruntfile-bad.js",
            shouldBeInvalid: true,
            tasksToCheck: "{gpii.tests.grunt.lintall.runner}.options.tasksToCheck"
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.tests.grunt.lintall.runTests",
            args:     ["{that}.options.testDefs"]
        }
    }
});
gpii.tests.grunt.lintall.runner();