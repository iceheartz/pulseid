const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const routes = require('./src/routes'); 
const { db } = require('./src/services/tokenService');

const app = express();
app.server = http.createServer(app);

app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api/', routes);

db.sync()
.then(() => {
  console.log('Database initialization Completed.')
}).then(()=> {
  app.server.listen(8888);
  console.log(`Server started, Listening to port ${app.server.address().port}`);
}).catch( err => {
  console.error('Error occurred when Database tries to initiate', err);
})


