# fluid-grunt-lint-all

This grunt plugin provides a combined rollup command that runs all lint checks typically used in Fluid projects. To add
it to your package, use a command like:

```shell
npm install fluid-grunt-lint-all --save-dev
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
    grunt.loadNpmTasks("fluid-grunt-lint-all");
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
    grunt.loadNpmTasks("fluid-grunt-lint-all");
    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);

    grunt.registerTask("default", ["lint"]);
};
```

## Running the Checks

Once you have installed the plugin and updated your `Gruntfile.js`, you should be able to run the `lint-all` command from
the root of your repository, as in `grunt lint-all`.

## Configuring Individual Checks

This plugin is a rollup that calls a range of individual checks.  All checks support the standard `src` array that
defines which material should be linted. For more information about the individual checks and links to their
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
| mdjsonlint                 | Check the validity and formatting of JSON code blocks within Markdown files. | (Provided by this package.  See below)) |

Please note that many of the above checks use our standard ESLint configuration, which is available in the
[eslint-config-fluid](https://github.com/fluid-project/eslint-config-fluid).  You will need to follow the installation
instructions in that package before you run many of the above checks.

### Customizing Configurations

Linting configurations can be customized by providing your own options in `Gruntfile.js` as shown in this example:

```javascript
module.exports = function (grunt) {
    grunt.config.init({
        eslint: {
            js: {
                options: {
                    rules: {
                        "eol-last": "off",
                        "strict": "off",
                        "no-undef": "off"
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
};
```

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
    grunt.loadNpmTasks("fluid-grunt-lint-all");
    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);

    grunt.registerTask("default", ["lint"]);
};

```

Please note, ignores must be expressed as negative patterns, i.e. `!./path/to/exclude/*.json`.  Also, Grunt's options
merging will completely replace the defaults if you set a custom `ignores` setting.   If you are trying to ignore
content that corresponds to one of the file types in `sources` (`js`, `json`, etc.), you're better off adding your
pattern(s) to a file-type-specific property.  If you need to change the global `ignores` option, you will need to
replicate any default rules (such as `!/package-lock.json`) in your custom `ignores` value.

## Tasks

This package provides a few key tasks.

### json-eslint

This task inspects all JSON(5) as though it were enclosed in a simple javascript fixture.  This does not check for
validity, but instead checks things like indentation and other code conventions.

### json-parser

This tasks uses VSCode's JSON language parsing service to attempt to parse JSON files, and to return information about
the location of any invalid JSON.

### mdjsonlint

This task uses [markdown-to-ast](https://github.com/textlint/textlint/tree/master/packages/markdown-to-ast) to extract
all code blocks within markdown content.  Only fenced code blocks tagged with the `json` or `json5` language will be
linted:

````markdown
The following will be scanned (and report an error):

```json
{
  key: "not quoted"
}
```

The following will be scanned (and will not report an error):

```json5
{
    key: "not quoted"
}
```

The following will not be scanned:

```snippet
someOperation(<garbage in>) => <garbage out>
```
````

Each code block is linted by attempting to parse it using either `JSON.parse`, or the `JSON5.parse` method provided by
[the `json5` library](https://github.com/json5/json5).  Errors are caught and converted to a common format that includes
the information needed to identify which file, line number and column number are associated with the error.  Note that
the first failure in a single fenced code block may prevent you from seeing subsequent errors in the same fenced code
block.
