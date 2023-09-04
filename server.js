require('dotenv').config();

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const mongoose = require('mongoose', { useNewUrlParser: true });
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash');
const session = require('express-session');
const User = require('./models/User');
const server = require('http').createServer(app);
const mongo = require('mongodb').MongoClient;
const client = require('socket.io')(server).sockets;


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}));

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
//db.once('open', () => console.error("Connected to Database"));
db.once('open', () => {console.error("Connected to Database")});

client.on('connection', async function(socket) {
    let message = mongoose.connection.db.collection('messages');

    sendStatus = function(s) {
        socket.emit('status', s);
    };
    //console.log(message)
    //Get message from mongo collection
   /* await message.find().limit(100).sort({_id: 1}).toArray(function(err, res){
        if(err) {
            throw err;
        }

        console.log('bezveze2')
        //Emit the messages
        socket.emit('output', res)
    });*/

    //Get message from mongo collection
    messages = await message.find().limit(100).sort({_id: 1}).toArray()

    //Emit the messages
    socket.emit('output', messages)

    //Handle input events
    socket.on('input', function(data){
        let messageText = data.message;
        let user = data.user;
        let chat = data.chat;

        //Check for name ann message
        if(messageText == '') {
            //Send error status
            sendStatus('Please enter a message');
        } else {
            //insert message
            message.insertOne({message: messageText, user: user, chat: chat });
            
            client.emit('output', [data]);

            //Send staus object
            sendStatus({
                message: 'Message sent',
                clear: true
            });
        }
    });

    //Handle clear
    socket.on('clear', async function(data){
        //Remove all messages from collection
        await message.deleteMany({});
        //Emit cleared
        socket.emit('cleared');
    })
});


const initializePassport = require('./passport-config');
initializePassport(
    passport, 
    username => {
        return User.findOne({username: new RegExp('^' + username + '$', "i") });
    },
    id => {
        return User.findById(id);
    }
);

app.use(flash());
app.use(session( {
    secret: process.env.SESSION_SECRET,
     resave: false,
     saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(function(req,res,next){
    res.locals.user = req.user;
    next();
})



app.get('/login', checkNotAuthenticated, async (req, res) => {
    res.render('login');
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: 'login',
    failureFlash: true
}));



app.get('/register', checkNotAuthenticated, async (req, res) => {
    res.render('register');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            role: req.body.organiser != null ? 'Organiser' : 'User'
        });
        const newUser = await user.save();
        //res.status(201).json(newUser);
        res.redirect('login');
    } catch (err) {
        res.render('users/new', {
            user: user,
            errorMessage: 'Error creating User'
        })
    }
});

app.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
      });
});


function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}


const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");
const eventRouter = require("./routes/events");
const locationRouter = require("./routes/locations");
const categoryRouter = require("./routes/categories");
const roleRouter = require("./routes/roles");
const chatRouter = require("./routes/chats");

app.use('/', indexRouter);
app.use('/users/', userRouter);
app.use('/events/', eventRouter);
app.use('/locations/', locationRouter);
app.use('/categories/', categoryRouter);
app.use('/roles/', roleRouter);
app.use('/chats/', chatRouter);

app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
  });

//Zamjenjeno 'app' sa 'server'
server.listen(5000, function () {
    console.log("Server Started: http://localhost:5000");
});

