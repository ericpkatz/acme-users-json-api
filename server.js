const express = require('express');
const app = express();
const uuid = require('uuid');
app.use(express.json());
app.use(require('cors')());
const products = require('./products.json');
const companies = require('./companies.json');
const offerings = require('./offerings.json');
const users = require('./users.json');
const following = require('./following.json');
const fs = require('fs');

const port = process.env.PORT || 3000;

fs.writeFile('following.json', JSON.stringify([]), (err, response)=> {
  app.listen(port, ()=> console.log(`listening on port ${port}`));
});

app.get('/', (req, res, next)=> res.send('see readme'));

app.get('/api/products', (req, res, next)=> res.send(products));
app.get('/api/companies', (req, res, next)=> res.send(companies));
app.get('/api/offerings', (req, res, next)=> res.send(offerings));
app.get('/api/users', (req, res, next)=> res.send(users));
app.get('/api/users/random', (req, res, next)=> {
  const rnd = Math.floor(Math.random()*users.length);
  res.send(users[rnd]);
});

app.get('/api/users/detail/:id', (req, res, next)=> {
  const user = users.find( user => user.id === req.params.id);
  if(!user){
    return res.sendStatus(404);
  }
  res.send(user);
});

app.get('/api/users/:id/followingCompanies', (req, res, next)=> {
  const followed = following.filter( f => f.userId === req.params.id);
  res.send(followed);
});

app.post('/api/users/:id/followingCompanies', (req, res, next)=> {
  const { companyId } = req.body;
  if(!companyId){
    return res.status(500).send({ message: 'companyId required in req.body'});
  }
  const company = companies.find(c => req.body.companyId === c.id);
  if(!company){
    return res.status(500).send({ message: 'no company matches id'});
  }
  const user = users.find(u => u.id === req.params.id);
  if(!user){
    return res.status(500).send({ message: 'no user matches id'});
  }
  const followed = following.filter( f => f.userId === req.params.id);
  if(followed.find( f => f.companyId === companyId)){
    return res.status(500).send({ message: 'user is already following company'});
  }
  const favorite = {userId: req.params.id, companyId, id: uuid()};
  following.push(favorite);
  fs.writeFile('following.json', JSON.stringify(following, null, 2), (err)=> {
    if(err){
      return res.status(500).send({ message: err.message});
    }
    res.send(favorite);
  });
});
app.delete('/api/users/:id/followingCompanies/:id', (req, res, next)=> {
  const followed = following.filter( f => f.id === req.params.id);
  if(!followed){
    return res.status(500).send({ message: 'company not being followed'});
  }
  fs.writeFile('following.json', JSON.stringify(following.filter(f => f.id !== req.params.id), null, 2), (err)=> {
    if(err){
      return res.status(500).send({ message: err.message});
    }
    res.sendStatus(200);
  });
});
