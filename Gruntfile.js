/*

    fluid-grunt-lint-all

    https://github.com/fluid-project/fluid-grunt-lint-all

    Copyright (c) 2018 Raising the Floor International.

    Licensed under the BSD-3-Clause license.

*/
"use strict";
module.exports = function (grunt) {
    grunt.initConfig({
        lintAll: {
            sources: {
                js:    ["tasks/*.js", "tests/**/*.js", "./*.js", "!tests/fixtures/js/bad.js"],
                md:    [ "./*.md", "tests/**/*.md", "!tests/fixtures/md/bad.md", "!tests/fixtures/md/badJson5.md"],
                json:  ["./*.json", "./.*.json", "tests/**/*.json", "!tests/fixtures/json/bad.json"],
                json5: ["./*.json5", "tests/**/*.json5", "!tests/fixtures/json5/bad.json5", "!tests/fixtures/json5/dangling-comma.json5"],
                css:  ["./*.css", "tests/**/*.css", "!tests/fixtures/css/bad.css"],
                scss:  ["./*.scss", "tests/**/*.scss", "!tests/fixtures/scss/bad.scss"],
                other: ["./.*"]
            }
        }
    });

    // NOTE: DO NOT use this file as a template, this only works from this package itself.  See the README for usage instructions.
    grunt.loadTasks("tasks");

    grunt.registerTask("lint", "Run all lint checks.", ["lint-all"]);
};
