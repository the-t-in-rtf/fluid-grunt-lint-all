/*

    A test gruntfile that should be unhappy with all the content it validates.

 */
/* eslint-env node */
"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        mdjsonlint: {
            src: ["./tests/markdown/bad*.md"]
        }
    });

    grunt.loadTasks("tasks");
};
