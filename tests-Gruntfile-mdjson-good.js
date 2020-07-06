/*

    A test gruntfile that should be happy with all the content it validates.

 */
/* eslint-env node */
"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        mdjsonlint: {
            src: ["./tests/markdown/good*.md"]
        }
    });

    grunt.loadTasks("tasks");
};
