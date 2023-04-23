const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user')
const bcrypt = require("bcryptjs");

// set up local strategy
const verifyCallback = (username, password, done) => {

    User.findOne({ username: username })
        .then((user) => {

            if (!user) { return done(null, false) }            
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) return done(err);
                // Passwords match, log user in!
                if (res) return done(null, user);
                // Passwords do not match!
                else return done(null, false, { message: "Incorrect password" });
        })
       }
    )
}

const strategy  = new LocalStrategy(verifyCallback);

passport.use(strategy);

// set up serialize user and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});