const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/api');
const mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/MongoDB');
mongoose.Promise = global.Promise;


app.use(bodyParser.json());

app.use('/api', routes);


app.listen(3000, () => {
    console.log('Listening..');
})