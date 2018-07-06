/*

    A rollup that sanitises Grunt's require handling and then requires the rest of the tasks in this package.
*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");
require("../src/load-npm-tasks-properly");
module.exports = function (grunt) {
    gpii.grunt.lintAll.fixGruntTaskLoading(grunt);

    grunt.loadTasks("src/tasks");
};
