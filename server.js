const express = require('express');
const app = express();
const products = require('./products.json');
const companies = require('./companies.json');
const offerings = require('./offerings.json');

const port = process.env.PORT || 3002;

app.listen(port, ()=> console.log(`listening on port ${port}`));

app.get('/products', (req, res, next)=> res.send(products));
app.get('/companies', (req, res, next)=> res.send(companies));
app.get('/offerings', (req, res, next)=> res.send(offerings));
