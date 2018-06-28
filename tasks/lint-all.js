"use strict";
var fluid = require("infusion");
require("../");

module.exports = function (grunt) {
    grunt.config.merge({
        // Standardised linting checks, without any sources defined.
        lintAll: {
            sources: {
                md: [],
                js: [],
                json: [],
                json5: []
            }
        },
        eslint: {
            js: {
                src: ["<%= lintAll.sources.js %>"]
            },
            md: {
                src: ["<%= lintAll.sources.md %>"],
                options: {
                    configFile: fluid.module.resolvePath("%gpii-grunt-lint-all/.eslintrc-md.json")
                }
            }
        },
        jsonlint: {
            src: ["<%= lintAll.sources.json %>"]
        },
        json5lint: {
            src: ["<%= lintAll.sources.json5 %>"],
            options: {
                enableJSON5: true
            }
        },
        lintspaces: {
            src: ["<%= lintAll.sources.json %>", "<%= lintAll.sources.json5 %>", "<%= lintAll.sources.js %>", "<%= lintAll.sources.md %>"],
            options: {
                newline: true,
                indentation: "spaces",
                spaces: 4
            }
        },
        mdjsonlint: {
            src: ["<%= lintAll.sources.md %>"]
        },
        markdownlint: {
            src: ["<%= lintAll.sources.md %>"],
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
            src: ["<%= lintAll.sources.json %>", "<%= lintAll.sources.json5 %>"],
            options: {
                /*

                    Our approach doesn't work well with leading comments in json5 files, which appear to be incorrectly
                    indented.  As we check for indentation using the grunt-lintspaces plugin, we can safely disable
                    that check here.

                */
                "rules": {
                    "indent": "off"
                }
            }
        }
    });

    grunt.loadNpmTasks("fluid-grunt-eslint");
    grunt.loadNpmTasks("fluid-grunt-json5lint");
    grunt.loadNpmTasks("gpii-grunt-mdjson-lint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-markdownlint");
    grunt.loadNpmTasks("grunt-lintspaces");

    // By default, lint and run all tests.
    grunt.registerTask("lint-all", "Apply eslint, jsonlint, json5lint, and various markdown linting checks", ["eslint:js", "jsonlint", "json5lint", "markdownlint", "eslint:md", "mdjsonlint", "json-eslint", "lintspaces"]);
};
