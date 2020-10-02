/*

    Gruntfile to lint Infusion with the current code.

    Copyright (c) 2020 Raising the Floor International.

    Licensed under the BSD-3-Clause license.

*/
"use strict";
module.exports = function (grunt) {
    grunt.initConfig({
        lintAll: {
            ignore: ["!package-lock.json", "!./node_modules/!infusion/**/*", "!./reports/**/*", "!./coverage/**/*", "!./build/**/*", "!.DS_Store", "!*~"],

            sources: {
                md: ["./node_modules/infusion/**/*.md", "!./node_modules/infusion/src/**/lib/**/*.md", "!./node_modules/infusion/demos/**/lib/**/*.md", "!./node_modules/infusion/tests/**/lib/**/*.md"],
                js: ["./node_modules/infusion/**/*.js", "!./node_modules/infusion/src/**/lib/**/*.js", "!./node_modules/infusion/demos/**/lib/**/*.js", "!./node_modules/infusion/dist/**/*.js", "!./node_modules/infusion/tests/**/lib/**/*.js", "!./node_modules/infusion/tests/**/infusion-1.5.js"],
                json: ["./node_modules/infusion/**/*.json", "./node_modules/infusion/.nycrc", "./node_modules/infusion/src/thirdPartyDependencies.json", "!./node_modules/infusion/src/lib/**/*.json", "!./node_modules/infusion/dist/**/*.json"],
                other: ["./node_modules/infusion/**/.*"]
            }
        }
    });

    // NOTE: DO NOT use this file as a template, this only works from this package itself.  See the README for usage instructions.
    grunt.loadTasks("tasks");

    grunt.registerTask("lint", "Run all lint checks.", ["lint-all"]);
};
