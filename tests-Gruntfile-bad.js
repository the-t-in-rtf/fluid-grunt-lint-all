/*

    Copyright (c) 2018 Raising the Floor International.

    Licensed under the BSD-3-Clause license.
*/
/*

    A test fixture to verify that invalid files are correctly reported as invalid.  Must live in the repository root so
    that Grunt's package resolution works properly.

    NOTE: DO NOT use this file as a template, this is a test fixture, and only works from this package itself.  See the
    README for usage instructions.

*/
"use strict";
module.exports = function (grunt) {
    grunt.loadTasks("tasks");

    grunt.config.merge({
        lintAll: {
            sources: {
                js:    ["./tests/fixtures/js/bad.js"],
                json:  ["./tests/fixtures/json/bad.json"],
                json5: ["./tests/fixtures/json5/bad.json5"],
                md:    [ "./tests/fixtures/md/bad.md"],
                other: ["./tests/fixtures/other/.bad"]
            }
        }
    });
};
