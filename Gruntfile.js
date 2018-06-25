/*
 * grunt-gpii-grunt-lintall
 *
 * https://github.com/GPII/gpii-grunt-lintall
 *
 * Copyright (c) 2018 Raising the Floor International.
 *
 * Licensed under the BSD-3-Clause license.
 */
"use strict";
module.exports = function (grunt) {
    // NOTE: DO NOT use this file as a template, this only works from this package itself.  See the README for usage instructions.
    grunt.loadTasks("tasks");

    grunt.config.merge({
        eslint: {
            js: {
                src: ["tasks/*.js", "tests/**/*.js", "./*.js"]
            },
            md: {
                options: {
                    configFile: ".eslintrc-md-nope.json"
                },
                src: [ "./*.md"]
            }
        },
        jsonlint: {
            src: ["./*.json"]
        },
        json5lint: {
            src: ["./*.json5"]
        },
        mdjsonlint: {
            src: ["./*.md"]
        },
        markdownlint: {
            src: ["./*.md"]
        }
    });
};
