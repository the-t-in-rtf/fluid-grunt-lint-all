/*
 *
 * Copyright (c) 2018 Raising the Floor International.
 *
 * Licensed under the BSD-3-Clause license.
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
        eslint: {
            js: {
                src: ["./tests/fixtures/js/bad.js"]
            },
            md: {
                src: [ "./tests/fixtures/md/bad.md"]
            }
        },
        jsonlint: {
            src: ["./tests/fixtures/json/bad.json"]
        },
        json5lint: {
            src: ["./tests/fixtures/json5/bad.json5"]
        },
        mdjsonlint: {
            src: ["./tests/fixtures/md/bad.md"]
        },
        markdownlint: {
            src: ["./tests/fixtures/md/bad.md"]
        }
    });
};
