/* eslint-env node */
"use strict";
var fluid = require("infusion");

var jqUnit = require("node-jqunit");
var fs     = require("fs");

require("../../src/mdjson-linter");

fluid.registerNamespace("fluid.tests.mdjsonLinter");

fluid.tests.mdjsonLinter.runAllTests = function (that) {
    fluid.each(that.options.testDefs, fluid.tests.mdjsonLinter.runSingleTest);
};

fluid.tests.mdjsonLinter.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var resolvedPath = fluid.module.resolvePath(testDef.path);
        var mdContent = fs.readFileSync(resolvedPath, "utf8");
        var errors = fluid.mdjsonLinter(mdContent);
        if (testDef.hasErrors) {
            jqUnit.assertTrue("There should be errors...", errors.length > 0);
        }
        else {
            jqUnit.assertTrue("There should be no errors...", errors.length === 0);
        }
    });
};

fluid.defaults("fluid.tests.mdjsonLinter.testRunner", {
    gradeNames: ["fluid.component"],
    testDefs: {
        goodJson: {
            message: "Valid JSON should validate correctly...",
            path:    "%fluid-grunt-lint-all/tests/fixtures/md/good.md"
        },
        goodJson5: {
            message: "Valid JSON5 should validate correctly...",
            path:    "%fluid-grunt-lint-all/tests/fixtures/md/goodJson5.md"
        },
        badJson: {
            message:   "Invalid JSON should result in linting errors...",
            path:      "%fluid-grunt-lint-all/tests/fixtures/md/bad.md",
            hasErrors: true
        },
        badJson5: {
            message:   "Invalid JSON5 should result in linting errors...",
            path:      "%fluid-grunt-lint-all/tests/fixtures/md/badJson5.md",
            hasErrors: true
        },
        snippet: {
            message: "An invalid non-JSON(5) 'snippet' should not report any errors...",
            path:    "%fluid-grunt-lint-all/tests/fixtures/md/snippet.md"
        }
    },
    listeners: {
        "onCreate.setModule": {
            funcName: "jqUnit.module",
            args:     ["Unit tests for the static linting functions..."]
        },
        "onCreate.runTests": {
            funcName: "fluid.tests.mdjsonLinter.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.tests.mdjsonLinter.testRunner();
