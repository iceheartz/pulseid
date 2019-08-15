const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many request from this IP, please try again'
});

const swagger = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json')

const routes = require('./src/routes'); 
const { db } = require('./src/services/tokenService');

const app = express();
app.server = http.createServer(app);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(limiter);

app.use('/api/', routes);
app.use('/api-docs', swagger.serve, swagger.setup(swaggerDoc));
app.use((req, res) => res.status(404).send('Not found'));

db.sync()
.then(() => {
  console.log('Database initialization Completed.')
}).then(()=> {
  app.server.listen(8888);
  console.log(`Server started, Listening to port ${app.server.address().port}`);
}).catch( err => {
  console.error('Error occurred when Database tries to initiate', err);
})


