const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.SERVER_PORT || 8000;
const morgan = require('morgan');
const userRoute = require('./routes/user');

app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

module.exports = app.listen(PORT, () => {
  console.info(`Connection is setup at ${ PORT }`);
});

app.use(userRoute);

app.use((err, req, res, next) => {
  console.info(err.stack);
  res.status(err.statusCode || 500).send({ Error: 'Internal Server Error' });
});
