const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8000;
const userRoute = require('./routes/user');
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


module.exports = app.listen(PORT, () => {
    console.log(`Connection is setup at ${PORT}`);
});

app.use(userRoute);

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send(err);
});
