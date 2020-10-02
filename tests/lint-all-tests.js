"use strict";
var fluid = require("infusion");
require("..");

var jqUnit = require("node-jqunit");

var child_process = require("child_process");

jqUnit.module("Tests for Fluid grunt lint-all plugin.");

fluid.registerNamespace("fluid.tests.grunt.lintAll");

fluid.tests.grunt.lintAll.runTests = function (testDefs) {
    var cwd = fluid.module.resolvePath("%fluid-grunt-lint-all");
    fluid.each(testDefs, function (testDef) {
        jqUnit.test(testDef.message, function () {
            // One check per task plus an extra check for the rollup when running error tests.
            var expected = testDef.allTasks.length + (testDef.shouldBeInvalid ? 1 : 0);
            jqUnit.expect(expected);

            fluid.each(testDef.allTasks, function (task) {
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

fluid.defaults("fluid.tests.grunt.lintAll.runner", {
    gradeNames: ["fluid.component"],
    allTasks:          ["eslint:js", "eslint:md", "json-eslint", "json-parser", "json5lint", "lintspaces:jsonindentation", "lintspaces:newlines", "markdownlint", "mdjsonlint", "stylelint", "lint-all"],
    configurableTasks: ["eslint:js", "eslint:md", "json-eslint", "json5lint", "lintspaces:jsonindentation", "lintspaces:newlines", "markdownlint", "mdjsonlint", "stylelint", "lint-all"],
    testDefs: {
        good: {
            message: "Valid content should be reported as valid.",
            gruntFile: "tests-Gruntfile-good.js",
            allTasks: "{fluid.tests.grunt.lintAll.runner}.options.allTasks"
        },
        bad: {
            message: "Invalid content should be reported as invalid.",
            gruntFile: "tests-Gruntfile-bad.js",
            shouldBeInvalid: true,
            allTasks: "{fluid.tests.grunt.lintAll.runner}.options.allTasks"
        },
        excludes: {
            message: "We should be able to exclude content from linting checks.",
            gruntFile: "tests-Gruntfile-excludes.js",
            allTasks: "{fluid.tests.grunt.lintAll.runner}.options.allTasks"
        },
        overrides: {
            message: "We should be able to override options for all configurable plugins.",
            gruntFile: "tests-Gruntfile-options-override.js",
            allTasks: "{fluid.tests.grunt.lintAll.runner}.options.configurableTasks"
        },
        noExpand: {
            message: "We should be able to disable expansion and merging.",
            gruntFile: "tests-Gruntfile-noExpand.js",
            allTasks: "{fluid.tests.grunt.lintAll.runner}.options.allTasks"
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.tests.grunt.lintAll.runTests",
            args:     ["{that}.options.testDefs"]
        }
    }
});

fluid.tests.grunt.lintAll.runner();
