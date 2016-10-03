'use strict';

const errors = require('../errors');
const ValueError = errors.ValueError;
const helpers = require('./internal/helpers.js');
const utils = require('../utils');
const parseStrictIntOrThrow = utils.parseStrictIntOrThrow;


module.exports = function ensureValidIsoDate (testIsoDate) {
    let year;
    let month;
    let day;
    let matchIsoDate;
    let newDate;

    if ('string' !== typeof testIsoDate) {
        throw new ValueError(`'${testIsoDate}' is not a string`);
    }

    matchIsoDate = testIsoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!matchIsoDate) {
        throw new ValueError(`'${testIsoDate}' is invalid ISO date format`);
    }

    year = helpers.ensureValidYear(matchIsoDate[1]);
    month = helpers.ensureValidMonth(matchIsoDate[2]);
    day = parseStrictIntOrThrow(matchIsoDate[3]);

    newDate = new Date(0);
    newDate.setUTCFullYear(year);
    newDate.setUTCMonth(month - 1);
    newDate.setUTCDate(day);

    if (testIsoDate !== newDate.toISOString().substr(0, 10)) {
        throw new ValueError(`'${testIsoDate}' is invalid ISO date format`);
    }

    return newDate;
};
