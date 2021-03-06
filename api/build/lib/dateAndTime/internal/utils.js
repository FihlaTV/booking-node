const errors = require('../../errors');
const ValueError = errors.ValueError;
const utils = require('../../utils');
const isIntOrThrow = utils.isIntOrThrow;

exports.mkDate = mkDate;
exports.setFirstDayOfMonth = setFirstDayOfMonth;
exports.setLastDayOfMonth = setLastDayOfMonth;

/**
 * mkDate - get new Date object
 *
 * @param  {number} year    year as int
 * @param  {number} month   month as int
 * @param  {number} day     day as int
 * @return {object}         new Date() object
 */
function mkDate (year, month, day) {
    let newDate;

    try {
        isIntOrThrow(year);
        isIntOrThrow(month);
        isIntOrThrow(day);
    } catch (e) {
        throw new TypeError(`year, month, day must be integer: ${year}, ${month}, ${day}`);
    }

    newDate = new Date(Date.UTC(year, month - 1, day));

    if (newDate.getUTCFullYear() !== year
            || newDate.getUTCMonth() !== month - 1
            || newDate.getUTCDate() !== day) {

        throw new ValueError(`date "${newDate}" does not match passed year, month, day; ${year}, ${month}, ${day}`);
    }

    return newDate;
}

function setFirstDayOfMonth (dObj) {
    if (!(dObj instanceof Date)) {
        throw new TypeError(`not an instance of Date: ${dObj}`);
    }

    dObj.setUTCDate(1);
    dObj.setUTCHours(0);
    dObj.setUTCMinutes(0);
    dObj.setUTCSeconds(0);
    dObj.setUTCMilliseconds(0);

    return dObj;
}

function setLastDayOfMonth (dObj) {
    const fullDay = 24 * 60 * 60 * 1000;

    if (!(dObj instanceof Date)) {
        throw new TypeError(`not an instance of Date: ${dObj}`);
    }

    dObj = setFirstDayOfMonth(dObj);
    // add 32 days
    dObj = setFirstDayOfMonth(new Date(dObj.getTime() + 32 * fullDay));
    // substract one day
    dObj = new Date(dObj.getTime() - fullDay);

    return dObj;
}
