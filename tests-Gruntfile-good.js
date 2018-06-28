/*

    Copyright (c) 2018 Raising the Floor International.

    Licensed under the BSD-3-Clause license.

*/
/*

    A test fixture to verify that valid files are correctly reported as valid.  Must live in the repository root so that
    Grunt's package resolution works properly.

    NOTE: DO NOT use this file as a template, this is a test fixture, and only works from this package itself.  See the
    README for usage instructions.

*/
"use strict";
module.exports = function (grunt) {
    grunt.config.merge({
        lintAll: {
            sources: {
                js:    ["./tests/fixtures/js/good.js"],
                json:  ["./tests/fixtures/json/good.json"],
                json5: ["./tests/fixtures/json5/good.json5"],
                md:    ["./tests/fixtures/md/good.md"]
            }
        }
    });

    grunt.loadTasks("tasks");
};
