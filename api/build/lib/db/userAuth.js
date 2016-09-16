"use strict";

const   co = require('co'),
        queryPromise = require('./internal/queryPromise');


module.exports = co.wrap(function * (email, pass) {
    let q, args, res;

    q = `
        SELECT  uid
        FROM    users
        WHERE   email = ?
                AND pass = ?
    `;
    args = [email, pass];

    res = yield queryPromise(q, args);
    return res.length === 1 ? res[0].uid : null;
});