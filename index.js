/*

Fluid Grunt "Lint All" Plugin

Copyright 2018 Raising the Floor International.

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

*/
/* eslint-env node */
"use strict";

var fluid = require("infusion");

// Register this module so that people can reuse our configuration, etc. using `fluid.module.resolvePath("%fluid-grunt-lint-all/path/to/content")`.
fluid.module.register("fluid-grunt-lint-all", __dirname, require);
