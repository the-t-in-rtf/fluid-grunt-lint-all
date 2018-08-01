"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../index");
require("../src/load-npm-tasks-properly");

module.exports = function (grunt) {
    gpii.grunt.lintAll.fixGruntTaskLoading(grunt);

    grunt.config.merge({
        // Standardised linting checks, without any sources defined.
        lintAll: {
            sources: {
                md: [],
                js: [],
                json: [],
                json5: [],
                other: []
            },
            ignores: ["!./package-lock.json", "!./node_modules/**/*", "!./reports/**/*", "!./coverage/**/*", "!./build/**/*", "!./**/.DS_Store"]
        },
        eslint: {
            js: {
                src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.js %>"]
            },
            md: {
                src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.md %>"],
                options: {
                    configFile: fluid.module.resolvePath("%gpii-grunt-lint-all/.eslintrc-md.json")
                }
            }
        },
        jsonlint: {
            src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.json %>"]
        },
        json5lint: {
            src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.json5 %>"],
            options: {
                enableJSON5: true
            }
        },
        lintspaces: {
            newlines: {
                src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.json %>", "<%= lintAll.sources.json5 %>", "<%= lintAll.sources.js %>", "<%= lintAll.sources.md %>", "<%= lintAll.sources.other %>"],
                options: {
                    newline: true
                }
            },
            jsonindentation: {
                src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.json %>"],
                options: {
                    indentation: "spaces",
                    spaces: 4
                }
            }
        },
        mdjsonlint: {
            src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.md %>"]
        },
        markdownlint: {
            src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.md %>"],
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
        },
        "json-eslint": {
            src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.json %>", "<%= lintAll.sources.json5 %>"],
            options: {
                "rules": {
                    /*

                        Our approach doesn't work well with leading comments in json5 files, which appear to be incorrectly
                        indented.  As we check for indentation using the grunt-lintspaces plugin, we can safely disable
                        that check here.

                    */
                    "indent": "off",
                    /*
                        Allow ES5 multi-line strings.
                    */
                    "no-multi-str": "off"
                }
            }
        }
    });

    grunt.loadNpmTasksProperly("fluid-grunt-eslint");
    grunt.loadNpmTasksProperly("fluid-grunt-json5lint");
    grunt.loadNpmTasksProperly("gpii-grunt-mdjson-lint");
    grunt.loadNpmTasksProperly("grunt-jsonlint");
    grunt.loadNpmTasksProperly("grunt-markdownlint");
    grunt.loadNpmTasksProperly("grunt-lintspaces");

    // By default, lint and run all tests.
    grunt.registerTask("lint-all", "Apply eslint, jsonlint, json5lint, and various markdown linting checks", ["eslint", "jsonlint", "json5lint", "markdownlint", "mdjsonlint", "json-eslint", "lintspaces"]);
};
