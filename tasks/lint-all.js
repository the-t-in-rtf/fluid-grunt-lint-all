"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../index");
require("../src/load-npm-tasks-properly");
require("gpii-glob");

module.exports = function (grunt) {
    gpii.grunt.lintAll.fixGruntTaskLoading(grunt);

    gpii.grunt.lintAll.expandPaths = function (grunt) {
        if (grunt.config.get("lintAll.expandPaths")) {
            if (!grunt.config.get("lintAll.expanded")) {
                // Expand all paths in lintAll.sources and lintAll.ignores.
                var cwd = grunt.config.get("lintAll.cwd") || process.cwd();
                var rawSources = grunt.config.get("lintAll.sources");
                var minimatchOptions = grunt.config.get("lintAll.minimatchOptions");
                var ignores = grunt.config.get("lintAll.ignore");
                var excludes = fluid.transform(ignores, gpii.glob.positivePattern);

                var expandedSources = fluid.transform(rawSources, function (globbedPaths) {
                    return gpii.glob.findFiles(cwd, globbedPaths, excludes, minimatchOptions);
                });

                grunt.config.set("lintAll.expanded.sources", expandedSources);
            }

            // Merge expanded paths into named configurations.
            grunt.config.merge({
                eslint: {
                    js: {
                        src: ["<%= lintAll.expanded.sources.js %>"]
                    },
                    md: {
                        src: ["<%= lintAll.expanded.sources.md %>"]
                    }
                },
                jsonlint: {
                    src: ["<%= lintAll.expanded.sources.json %>"]
                },
                json5lint: {
                    src: ["<%= lintAll.expanded.sources.json5 %>"]
                },
                lintspaces: {
                    newlines: {
                        src: ["<%= lintAll.expanded.sources.json %>", "<%= lintAll.expanded.sources.json5 %>", "<%= lintAll.expanded.sources.js %>", "<%= lintAll.expanded.sources.md %>", "<%= lintAll.expanded.sources.other %>"]
                    },
                    jsonindentation: {
                        src: ["<%= lintAll.sources.json %>"]
                    }
                },
                mdjsonlint: {
                    src: ["<%= lintAll.expanded.sources.md %>"]
                },
                markdownlint: {
                    src: ["<%= lintAll.expanded.sources.md %>"]
                },
                "json-eslint": {
                    src: ["<%= lintAll.expanded.sources.json %>", "<%= lintAll.expanded.sources.json5 %>"]
                }
            });
        }
        else {
            grunt.config.merge({
                eslint: {
                    js: {
                        src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.js %>"]
                    },
                    md: {
                        src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.md %>"]
                    }
                },
                jsonlint: {
                    src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.json %>"]
                },
                json5lint: {
                    src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.json5 %>"]
                },
                lintspaces: {
                    newlines: {
                        src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.json %>", "<%= lintAll.sources.json5 %>", "<%= lintAll.sources.js %>", "<%= lintAll.sources.md %>", "<%= lintAll.sources.other %>"]
                    },
                    jsonindentation: {
                        src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.json %>"]
                    }
                },
                mdjsonlint: {
                    src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.md %>"]
                },
                markdownlint: {
                    src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.md %>"]
                },
                "json-eslint": {
                    src: ["<%= lintAll.ignores %>", "<%= lintAll.sources.json %>", "<%= lintAll.sources.json5 %>"]
                }
            });
        }
    };

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
            ignore: ["!package-lock.json", "!./node_modules/**/*", "!./reports/**/*", "!./coverage/**/*", "!./build/**/*", "!.DS_Store", "!*~"],
            expandPaths: true,
            minimatchOptions: {
                dot: true,      // Include matches like ".eslintrc.json" against patterns like "*.json"
                matchBase: true // Allows us to use patterns like ".DS_Store" and have them excluded at any level.
            }
        },
        eslint: {
            md: {
                options: {
                    configFile: fluid.module.resolvePath("%gpii-grunt-lint-all/.eslintrc-md.json")
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
                    newline: true
                }
            },
            jsonindentation: {
                options: {
                    indentation: "spaces",
                    spaces: 4
                }
            }
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
        },
        "json-eslint": {
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
                    "no-multi-str": "off",
                    "trailing-comma": "off"
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

    var initialForce = grunt.option("force") || false;

    grunt.registerTask("lint-all:pre", "Prepare to run all checks.", function () {
        grunt.option("force", true);
    });

    grunt.registerTask("lint-all:post", "Clean up after linting run.", function () {
        grunt.option("force", initialForce);
        if (grunt.fail.warncount) {
            grunt.warn("Linting run failed with " + grunt.fail.warncount + " warning(s), check the log output for details.");
        }
    });

    fluid.each(
        ["eslint", "jsonlint", "json5lint", "markdownlint", "mdjsonlint", "json-eslint", "lintspaces"],
        function (taskName) {
            var wrappedName = "wrapped-" + taskName;
            grunt.task.renameTask(taskName, wrappedName);

            // register our wrapper around the task.
            grunt.registerTask(taskName, "wrapped copy of " + taskName, function () {
                gpii.grunt.lintAll.expandPaths(grunt);

                // Expose the configurations associated with their default names to our renamed  copies of the underlying tasks.
                grunt.config.set(wrappedName, grunt.config.get(taskName));

                grunt.task.run(wrappedName);
            });
        }
    );

    grunt.registerTask("lint-all", "Apply eslint, jsonlint, json5lint, and various markdown linting checks", function () {
        gpii.grunt.lintAll.expandPaths(grunt);
        grunt.task.run([
            "lint-all:pre",
            "eslint",
            "jsonlint",
            "json5lint",
            "markdownlint",
            "mdjsonlint",
            "json-eslint",
            "lintspaces",
            "lint-all:post"
        ]);
    });
};
