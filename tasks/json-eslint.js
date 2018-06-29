/*

    A custom task to validate all JSON(5) as though it were enclosed in a simple javascript fixture.  This does not
    check for validity, but instead checks things like indentation and other code conventions.

*/
/* eslint-env node */
"use strict";
var fluid  = require("infusion");
var eslint = require("fluid-eslint");

module.exports = function (grunt) {
    // Wrap the JSON(5) content in minimal valid Javascript code so tha we can test it using ESLint.
    var wrapperTemplate = "/* eslint-env node */ \"use strict\"; var wrappedVar = %jsonContent; console.log(wrappedVar);\n";
    grunt.registerMultiTask("json-eslint", "Lint JSON(5) files against ESLint rules.", function () {
        var opts = this.options({});

        if (this.filesSrc.length === 0) {
            grunt.warn("Could not find any files to validate.");
            return true;
        }

        var engine = new eslint.CLIEngine(opts);

        var errorCount = 0;
        var fileCount  = 0;
        this.files.forEach(function (f) {
            var validPaths = f.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn("Source file '" + filepath + "' not found.");
                    return false;
                } else {
                    return true;
                }
            });

            fluid.each(validPaths, function (filepath) {
                fileCount++;
                try {
                    var jsonContent       = grunt.file.read(filepath);
                    var wrappedContent = fluid.stringTemplate(wrapperTemplate, {jsonContent: jsonContent});
                    var validationResults = engine.executeOnText(wrappedContent);
                    var fileErrorCount    = fluid.get(validationResults, "errorCount");
                    if (fileErrorCount) {
                        errorCount += fileErrorCount;
                        fluid.each(validationResults.results, function (singleError) {
                            fluid.each(singleError.messages, function (singleMessage) {
                                // TODO: Shorten this path sensibly
                                var errorMessage = filepath + " (" + singleMessage.line + ":" + singleMessage.column + "): " + singleMessage.message;
                                grunt.log.error(errorMessage);
                            });
                        });
                    }
                } catch (err) {
                    grunt.warn(err);
                    errorCount++;
                }
            });
        });

        if (errorCount) {
            grunt.log.error("Found " + errorCount + " errors in " + fileCount + " " + fileCount === 1 ? "file" : "files" + ".");
            return false;
        }
        else {
            grunt.log.ok(fileCount + " " + (fileCount === 1 ? "file" : "files") + " lint free.");
        }
    });
};
