/*

    Copyright (c) 2018 Raising the Floor International.

    Licensed under the BSD-3-Clause license.
*/
/*

    A test fixture to verify that we can override configuration options for one or more built-in checks.

    NOTE: DO NOT use this file as a template, this is a test fixture, and only works from this package itself.  See the
    README for usage instructions.

*/
"use strict";
module.exports = function (grunt) {
    grunt.initConfig({
        lintAll: {
            sources: {
                js:    ["./tests/fixtures/js/bad.js"],
                json:  ["./tests/fixtures/json/good.json"],
                json5: ["./tests/fixtures/json5/dangling-comma.json5"],
                md:    ["./tests/fixtures/md/bad.md"],
                other: ["./tests/fixtures/other/.bad"]
            }
        },
        eslint: {
            js: {
                options: {
                    rules: {
                        "eol-last": "off",
                        "strict": "off",
                        "no-undef": "off",
                        "indent": "off"
                    }
                }
            },
            md: {
                options: {
                    rules: {
                        semi: "off"
                    }
                }
            }
        },
        json5lint: {
            options: {
                enableJSON5: true
            }
        },
        lintspaces: {
            newlines: {
                options: {
                    newline: false
                }
            },
            jsonindentation: {
                options: {
                    indentation: false
                }
            }
        },
        markdownlint: {
            options: {
                config: {
                    "first-header-h1": false,
                    "first-line-h1": false
                }
            }
        },
        "json-eslint": {
            options: {
                "rules": {
                    "comma-dangle": "off"
                }
            }
        }
    });

    grunt.loadTasks("tasks");

    // Disable the mdjsonlint task, which has no configurable options, and which would otherwise fail.
    grunt.registerTask("mdjsonlint", fluid.identity);
};
