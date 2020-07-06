"use strict";
var fluid = require("infusion");

var resolve = require("fluid-resolve");

fluid.registerNamespace("fluid.grunt.lintAll");

/**
 *
 * This function works around Grunt's inability to resolve npm modules properly.  By default, `grunt.loadNpmTasks` can
 * only load modules that are either in a `node_modules` subdirectory immediately beneath the location of the
 * `Gruntfile.js` you are using, or in a `node_module`s directory in a parent directory.  This makes it difficult to use
 * more than one level of Grunt plugins, as you must ensure that each package's key dependencies are also available as
 * (dev) dependencies in your own package.
 *
 * This function addresses this limitation by adding a `loadNpmTasks` method which resolves the location of an npm
 * package to a full path, and then uses `grunt.loadTasks` to load any tasks in the package's `tasks` subdirectory.
 *
 * Note: This only partially addresses the shortcomings of Grunt's model, in that you can still have unresolvable
 * conflicts between Grunt plugins that use different versions of the same library.
 *
 * There is some talk of addressing both concerns in the future, you can follow the conversation here:
 * https://github.com/gruntjs/grunt/issues/1523
 *
 * @param {Object } grunt - The Grunt instance (i.e. the result of require-ing Grunt).
 *
 */
fluid.grunt.lintAll.fixGruntTaskLoading = function (grunt) {
    grunt.loadNpmTasksProperly = function (name) {
        var resolved = resolve.sync(name, {
            // Stupid function require to fake out resolve's algorithm which actually attempts to resolve "main", which does
            // not exist for grunt plugins. Instead we resolve onto the one file we are absolutely sure is there
            packageFilter: function (pkg) {
                pkg.main = "package.json";
                return pkg;
            }
        });
        resolved = resolved.substring(0, resolved.length - "package.json".length);
        grunt.loadTasks(resolved + "/tasks");
    };
};
