# gpii-grunt-lint-all

This grunt plugin provides a combined rollup command that runs all GPII lint checks. To add it to your package, use a
command like:

```shell
npm install gpii-grunt-lint-all --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile as shown in the following example:

```javascript
"use strict";
module.exports = function (grunt) {
    grunt.config.init({
        lintAll: {
            sources: {
                js:    ["./src/js/**/*.js", "tests/js/**/*.js", "./*.js", "!./src/lib/**/*.js"]
            }
        }
    });
    grunt.loadNpmTasks("gpii-grunt-lint-all");
    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);

    grunt.registerTask("default", ["lint"]);
};

```

By default, this plugin takes care of letting all of the sub-tasks know where to look for Javascript, JSON, JSON5, and
Markdown files, so you only need to configure the `lintAll` block as shown above.  If you need to exclude content for
a single file type, add a negated pattern at the *end* of the relevant source block, as show here.

```javascript
"use strict";
module.exports = function (grunt) {
    grunt.config.init({
        lintAll: {
            sources: {
                js:    ["./src/js/**/*.js", "tests/js/**/*.js", "./*.js", "!./src/lib/**/*.js"]
            }
        }
    });
    grunt.loadNpmTasks("gpii-grunt-lint-all");
    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);

    grunt.registerTask("default", ["lint"]);
};
```

## Running the Checks

Once you have installed the plugin and updated your `Gruntfile.js`, you should be able to run the `lint-all` command from
the root of your repository, as in `grunt lint-all`.

## Configuring Individual Checks

This plugin is a rollup that calls a range of individual checks.  All checks support the standard `src` array that
defines which material should be linted.  For more information about the individual checks and links to their
documentation, see below:

| Task                       | Description | Documentation |
| -------------------------- | ----------- | ------------- |
| eslint                     | Run both the `eslint:js` and `eslint:md` tasks (see below). | See below. |
| eslint:js                  | Check the validity and formatting of Javascript files. | [fluid-grunt-eslint](https://github.com/fluid-project/fluid-grunt-eslint) |
| eslint:md                  | Check the validity and formatting of Javascript code blocks in Markdown files. | [eslint-plugin-markdown](https://github.com/eslint/eslint-plugin-markdown) |
| json5lint                  | Check the validity of JSON5 files. | [fluid-grunt-json5lint](https://github.com/fluid-project/fluid-grunt-json5lint) |
| jsonlint                   | Check the validity and formatting of JSON files. | [grunt-jsonlint](https://github.com/brandonramirez/grunt-jsonlint) |
| lintspaces                 | Check for trailing carriage returns and indentation. | [grunt-lintspaces](https://github.com/schorfES/grunt-lintspaces) |
| lintspaces:jsonindentation | Check the indentation of JSON files. | [grunt-lintspaces](https://github.com/schorfES/grunt-lintspaces) |
| lintspaces:newlines        | Check for the presence of a carriage return at the end of a file. | [grunt-lintspaces](https://github.com/schorfES/grunt-lintspaces) |
| markdownlint               | Check the formatting of Markdown files. | [grunt-markdownlint](https://github.com/sagiegurari/grunt-markdownlint) |
| mdjsonlint                 | Check the validity and formatting of JSON code blocks within Markdown files. | [gpii-grunt-mdjson-lint](https://github.com/GPII/gpii-grunt-mdjson-lint) |

Please note that many of the above checks use our standard ESLint configuration, which is available in the
[eslint-config-fluid](https://github.com/fluid-project/eslint-config-fluid).  You will need to follow the installation
instructions in that package before you run many of the above checks.

## Global Ignores

All of the checks above are configured to avoid linting things like `package-lock.json`, coverage reports, and the
contents of the top-level `node_modules` directory.  You can override these by setting the `ignores` option, as shown
here:

```javascript
"use strict";
module.exports = function (grunt) {
    grunt.config.init({
        lintAll: {
            sources: {
                js:    ["./src/js/**/*.js", "tests/js/**/*.js", "./*.js", "!./src/lib/**/*.js"]
            },
            ignores: ["!./tests/intentionally-broken-content/**/*", "!./node_modules", "!./package-lock.json"]
        }
    });
    grunt.loadNpmTasks("gpii-grunt-lint-all");
    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);

    grunt.registerTask("default", ["lint"]);
};

```

Please note, ignores must be expressed as negative patterns, i.e. `!./path/to/exclude/*.json`.  Also, Grunt's options
merging will completely replace the defaults if you set a custom `ignores` setting.   If you are trying to ignore
content that corresponds to one of the file types in `sources` (`js`, `json`, etc.), you're better off adding your
pattern(s) to a file-type-specific property.  If you need to change the global `ignores` option, you will need to
replicate any default rules (such as `!/package-lock.json`) in your custom `ignores` value.
