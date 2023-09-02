/*require('dotenv').config();

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOVerride = require('method-override')
const mongoose = require('mongoose', { useNewUrlParser: true });

app.set('view-engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(methodOVerride('_method'));
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.error("Connected to Database"));


const jwt = require('jsonwebtoken');

let refreshTokens = [];

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken });
    })
})

app.delete('/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
})

app.post('/login', async (req, res) => {
    const username = req.body.username;
    const user = { name: username };

    const accessToken =  generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
}

app.listen(4000, function () {
    console.log("Server Started: http://localhost:4000");
});*/
