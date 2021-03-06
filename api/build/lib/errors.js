/**
 * Creating custom Error classes in Node.js
 * https://gist.github.com/justmoon/15511f92e5216fa2624b
 */

const util = require('util');

function ValueError (message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || '';
    this.extra = extra;
}
util.inherits(ValueError, Error);

function PermissionError (message, extra) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = message || '';
    this.extra = extra;
}
util.inherits(PermissionError, Error);

exports.ValueError = ValueError;
exports.PermissionError = PermissionError;
