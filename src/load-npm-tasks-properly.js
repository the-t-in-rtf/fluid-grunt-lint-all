"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

var resolve = require("fluid-resolve");

fluid.registerNamespace("gpii.grunt.lintAll");
gpii.grunt.lintAll.fixGruntTaskLoading = function (grunt) {
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
