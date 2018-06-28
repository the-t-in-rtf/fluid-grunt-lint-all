"use strict";
var foo = "bar";

/**
 * A function to test JSDocs support with, including complex indentation.
 * @param {String} myString - A string.
 * @return {Object} - A payload that contains:
 *  - `isError`: set to `true` if there's an error.
 *  - `message`: a mesage about the results of the call.
 */
var myFunc = function (myString) {
    console.log(myString);
    return { isError: false, message: "yay" };
};
myFunc(foo);
