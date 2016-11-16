'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const midWare = require('./lib/middlewares');
const cors = require('cors');
const logger = require('./lib/logger');
const routes = require('./lib/routes');
const loadSchema = require('./lib/db').loadSchema;
const corsOptions = {
    // origin: true,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-Requested-With', 'Authorization'],
};

app.use(bodyParser.json({type: ['json', 'text']}));
app.use(midWare.token);
app.use(cors(corsOptions));

app.get('/', routes.getIndex);
app.get('/reloadDb', routes.reloadDb); // TODO: remove
app.get('/item/:uid/:yearMonth', routes.getUnavailItemPeriod);
app.get('/group/:uid/:yearMonth', routes.getUnavailGroupPeriod);
app.get('/auth', routes.auth);

app.post('/item/:uid/:from..:to', routes.postItemBooking);
app.post('/new_account', routes.newAccount);

// token required
app.post('/company/:uid', midWare.validToken, routes.updateCompany);
app.post('/itemGroup/:uid', midWare.validToken, routes.updateItemGroup);
app.post('/item/:uid', midWare.validToken, routes.updateItem);

app.put('/group/:companyUid/:newGroupName', midWare.validToken, routes.putGroup);

app.get('/companies', midWare.validToken, routes.getCompanies);
app.get('/users', midWare.validToken, routes.getUsers);
app.get('/groups/:companyUid', midWare.validToken, routes.getGroups);
app.get('/items/:groupUid', midWare.validToken, routes.getItems);

loadSchema();

app.listen(3000, function () {
    logger.info('Example app listening on port 3000!');
});
