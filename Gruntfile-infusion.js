/*

    Gruntfile to lint Infusion with the current code.

    Copyright (c) 2020 Raising the Floor International.

    Licensed under the BSD-3-Clause license.

*/
"use strict";
module.exports = function (grunt) {
    grunt.initConfig({
        lintAll: {
            ignore: ["!./checkouts/infusion/package-lock.json", "!./node_modules/!infusion/**/*", "!./node_modules/reports/**/*", "!./checkouts/infusion/coverage/**/*", "!./checkouts/infusion/build/**/*", "!./checkouts/infusion/.DS_Store", "!./checkouts/infusion/*~"],

            sources: {
                md: ["./checkouts/infusion/**/*.md", "!./checkouts/infusion/src/**/lib/**/*.md", "!./checkouts/infusion/demos/**/lib/**/*.md", "!./checkouts/infusion/tests/**/lib/**/*.md"],
                js: ["./checkouts/infusion/**/*.js", "!./checkouts/infusion/src/**/lib/**/*.js", "!./checkouts/infusion/demos/**/lib/**/*.js", "!./checkouts/infusion/dist/**/*.js", "!./checkouts/infusion/tests/**/lib/**/*.js", "!./checkouts/infusion/tests/**/infusion-1.5.js"],
                json: ["./checkouts/infusion/**/*.json", "./checkouts/infusion/.nycrc", "./checkouts/infusion/src/thirdPartyDependencies.json", "!./checkouts/infusion/src/lib/**/*.json", "!./checkouts/infusion/dist/**/*.json"],
                other: ["./checkouts/infusion/**/.*"]
            }
        }
    });

    // NOTE: DO NOT use this file as a template, this only works from this package itself.  See the README for usage instructions.
    grunt.loadTasks("tasks");

    grunt.registerTask("lint", "Run all lint checks.", ["lint-all"]);
};
