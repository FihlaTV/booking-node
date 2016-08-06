"use strict";

var db = require('./db'),
    pool = db.pool,
    errors = require('./errors'),
    ValueError = errors.ValueError,
    dateAndTime = require('./dateAndTime'),
    uidLib = require('./uid'),
    httpErrorHandler;


httpErrorHandler = function (e, res) {
    if (e instanceof ValueError) {
        res.status(400).send(e);
    } else {
        throw e;
    }
};

exports.getIndex = function (req, res) {
    pool.query('SELECT NOW() AS now', function (err, rows, fields) {
        if (err) throw err;
        res.send('mysql says now is: ' + rows[0].now);
    });
};

exports.getUnavailItemPeriod = function (req, res) {
    var uid, yearMonth;

    try {
        uid = uidLib.ensureValidUid(req.params.uid);
        yearMonth = dateAndTime.ensureValidYearMonth(req.params.yearMonth);

        res.send({item_uid: uid, year: yearMonth.year, month: yearMonth.month});
    } catch (e) {
        httpErrorHandler(e, res);
    }
};

exports.getUnavailGroupPeriod = function (req, res) {
    var uid, yearMonth;

    try {
        uid = uidLib.ensureValidUid(req.params.uid);
        yearMonth = dateAndTime.ensureValidYearMonth(req.params.yearMonth);

        res.send({group_uid: uid, year: yearMonth.year, month: yearMonth.month});
    } catch (e) {
        httpErrorHandler(e, res);
    }
};

exports.postItemBooking = function (req, res) {
    var uid, fromDate, toDate;

    try {
        uid = uidLib.ensureValidUid(req.params.uid);
        fromDate = dateAndTime.ensureValidIsoDate(req.params.from);
        toDate = dateAndTime.ensureValidIsoDate(req.params.to);
        if (toDate < fromDate) {
            throw new ValueError(`${toDate} < ${fromDate}`);
        }

        res.send({uid: uid, from: fromDate, to: toDate});
    } catch(e) {
        httpErrorHandler(e, res);
    }
};

exports.auth = function (req, res) {
    var email = req.params.email;

    uidLib.getStrongUid(128, function (token) {
        res.send({email:email, pass:'xxx', token: token});
    });
};
