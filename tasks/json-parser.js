"use strict";
var fluid = require("infusion");
var jsonService = require("vscode-json-languageservice");
var fs = require("fs");

module.exports = function (grunt) {
    fluid.registerNamespace("fluid.lintAll.parseJson");

    // Sort validation errors by position (line, then column).
    fluid.lintAll.parseJson.sortByPosition = function (a, b) {
        if (a.line < b.line) {
            return -1;
        }
        else if (a.line > b.line) {
            return 1;
        }
        else if (a.character < b.character) {
            return -1;
        }
        else if (a.character > b.character) {
            return 1;
        }
        else { return 0; }
    };

    fluid.lintAll.parseJson.filterToExistingFiles = function (filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
            grunt.log.warn("Source file '" + filepath + "' not found.");
            return false;
        } else {
            return true;
        }
    };

    grunt.registerMultiTask("json-parser", "Lint JSON files using the VSCode linter.", function () {
        var opts = this.options({});

        if (this.filesSrc.length === 0) {
            grunt.warn("Could not find any files to validate.");
            return true;
        }

        var serviceHandle = jsonService.getLanguageService(opts);
        var errorCount = 0;
        var fileCount = 0;
        this.files.forEach(function (f) {
            var validPaths = f.src.filter(fluid.lintAll.parseJson.filterToExistingFiles);
            fluid.each(validPaths, function (filepath) {
                fileCount++;

                try {
                    var toParse = fs.readFileSync(filepath, { encoding: "utf8"});
                    var textDocument = jsonService.TextDocument.create(filepath, "json", 1, toParse);
                    var parsed = serviceHandle.parseJSONDocument(textDocument);

                    var fileErrors = [];
                    parsed.syntaxErrors.forEach(function (error) {
                        fileErrors.push({ line: error.range.start.line, character: error.range.start.character, message: error.message});
                    });

                    parsed.comments.forEach(function (comment) {
                        fileErrors.push({ line: comment.start.line, character: comment.start.character, message: "Comments are not allowed in JSON."});
                    });

                    if (fileErrors.length) {
                        errorCount += fileErrors.length;
                        fileErrors.sort(fluid.lintAll.parseJson.sortByPosition);
                        fileErrors.forEach(function (jsonParseError) {
                            var errorMessage = filepath + " (" + jsonParseError.line + ":" + jsonParseError.column + "): " + jsonParseError.message;
                            grunt.log.error(errorMessage);
                        });
                    }
                }
                catch (error) {
                    grunt.warn(error);
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
