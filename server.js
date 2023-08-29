require('dotenv').config();

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const mongoose = require('mongoose', { useNewUrlParser: true });

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.error("Connected to Database"));

const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");
const eventRouter = require("./routes/events");
const locationRouter = require("./routes/locations");
const categoryRouter = require("./routes/categories");
const roleRouter = require("./routes/roles");

app.use('/', indexRouter);
app.use('/users/', userRouter);
app.use('/events/', eventRouter);
app.use('/locations/', locationRouter);
app.use('/categories/', categoryRouter);
app.use('/roles/', roleRouter);


app.listen(5000, function () {
    console.log("Server Started: http://localhost:5000");
});