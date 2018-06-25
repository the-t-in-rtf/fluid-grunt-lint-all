"use strict";
var fluid = require("infusion");
require("../");

module.exports = function (grunt) {
    grunt.config.merge({
        // Standardised linting checks, without any sources defined.
        eslint: {
            js: {
            },
            md: {
                options: {
                    configFile: fluid.module.resolvePath("%gpii-grunt-lintall/.eslintrc-md.json")
                }
            }
        },
        jsonlint: {
        },
        json5lint: {
            options: {
                enableJSON5: true
            }
        },
        mdjsonlint: {
        },
        markdownlint: {
            options: {
                config: {
                    // See https://github.com/DavidAnson/markdownlint#rules--aliases for rule names and meanings.
                    "no-duplicate-header": false, // We use duplicate nested headers, as in section 1 and 2 both have the same sub-section name.
                    "no-trailing-punctuation": false,  // This catches headings that are questions, which seems wrong.
                    "header-style": { style: "atx" }, // Although we use a mix, in discussion with various team members, we agreed to try this for now.
                    "no-inline-html": false, // Obviously we need HTML
                    "line-length": {
                        line_length: 120,
                        tables:      false,
                        code_blocks: false
                    },
                    "ol-prefix": {style: "ordered"} // 1. 2. 3. etc
                }
            }
        }
    });

    grunt.loadNpmTasks("fluid-grunt-eslint");
    grunt.loadNpmTasks("fluid-grunt-json5lint");
    grunt.loadNpmTasks("gpii-grunt-mdjson-lint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-markdownlint");

    // By default, lint and run all tests.
    grunt.registerTask("lintall", "Apply eslint, jsonlint, json5lint, and various markdown linting checks", ["eslint:js", "jsonlint", "json5lint", "markdownlint", "eslint:md", "mdjsonlint"]);
};
