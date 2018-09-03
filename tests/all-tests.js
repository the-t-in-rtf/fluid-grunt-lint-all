"use strict";
var fluid = require("infusion");
require("..");

var gpii = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

var child_process = require("child_process");

jqUnit.module("Tests for GPII grunt lint-all plugin.");

fluid.registerNamespace("gpii.tests.grunt.lintAll");

gpii.tests.grunt.lintAll.runTests = function (testDefs) {
    var cwd = fluid.module.resolvePath("%gpii-grunt-lint-all");
    fluid.each(testDefs, function (testDef) {
        jqUnit.test(testDef.message, function () {
            // One check per task plus an extra check for the rollup when running error tests.
            var expected = testDef.tasksToCheck.length + (testDef.shouldBeInvalid ? 1 : 0);
            jqUnit.expect(expected);

            fluid.each(testDef.tasksToCheck, function (task) {
                var command = ["grunt", "--gruntfile", testDef.gruntFile, task].join(" ");
                jqUnit.stop();
                child_process.exec(command, { cwd: cwd}, function (error, stdout) {
                    jqUnit.start();
                    if (error) {
                        if (testDef.shouldBeInvalid) {
                            jqUnit.assert("The task '" + task + "' correctly reported invalid content.");
                            if (task === "lint-all") {
                                jqUnit.assertTrue(
                                    "The rollup should complete but throw a warning on linting failures.",
                                    stdout.match(/Linting run failed with [0-9]+ warning\(s\), check the log output for details./)
                                );
                            }
                        }
                        else {
                            jqUnit.fail("The task '" + task + "' should not have reported invalid content.");
                        }
                    }
                    else {
                        if (testDef.shouldBeInvalid) {
                            jqUnit.fail("The task '" + task + "' did not report invalid content.");
                        }
                        else {
                            jqUnit.assert("The task '" + task + "' correctly reported valid content.");
                        }
                    }
                });
            });
        });
    });
};

fluid.defaults("gpii.tests.grunt.lintAll.runner", {
    gradeNames: ["fluid.component"],
    tasksToCheck: ["eslint:js", "eslint:md", "json5lint", "mdjsonlint", "jsonlint", "markdownlint", "json-eslint", "lintspaces:jsonindentation", "lintspaces:newlines", "lint-all"],
    testDefs: {
        good: {
            message: "Valid content should be reported as valid.",
            gruntFile: "tests-Gruntfile-good.js",
            tasksToCheck: "{gpii.tests.grunt.lintAll.runner}.options.tasksToCheck"
        },
        bad: {
            message: "Invalid content should be reported as invalid.",
            gruntFile: "tests-Gruntfile-bad.js",
            shouldBeInvalid: true,
            tasksToCheck: "{gpii.tests.grunt.lintAll.runner}.options.tasksToCheck"
        },
        excludes: {
            message: "We should be able to exclude content from linting checks.",
            gruntFile: "tests-Gruntfile-excludes.js",
            tasksToCheck: "{gpii.tests.grunt.lintAll.runner}.options.tasksToCheck"
        },
        overrides: {
            message: "We should be able to override options for all configurable plugins.",
            gruntFile: "tests-Gruntfile-options-override.js",
            tasksToCheck: "{gpii.tests.grunt.lintAll.runner}.options.tasksToCheck"
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.tests.grunt.lintAll.runTests",
            args:     ["{that}.options.testDefs"]
        }
    }
});

gpii.tests.grunt.lintAll.runner();
