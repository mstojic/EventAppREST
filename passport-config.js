const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/User');

function initialize(passport, getUserByUsername, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username)
        if (user == null) {
            return done(null, false, { message: 'No user with that email' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password incorrect' })
            }
        } catch (e) {
            return done(e)
        }
    }


    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id);
        return done(null, user);
    });
}

async function getUserByUsername(username) {
    const user = await User.findOne({ username: new RegExp('^' + username + '$', "i") }).then(function (result) {
        console.log(result)
    });
    //console.log(user);
    return user;
}

module.exports = initialize;