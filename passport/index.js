const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
const userServices = require('../models/user/userServices');

passport.use(new LocalStrategy(
    async function(username, password, done) {
        const user = await userServices.checkCredential(username, password);
        if (user == 0) {
            return done(null, false, { message: 'Incorrect username and password.' });
        } else if (user == -1) {
            return done(null, false, { message: 'Your account is blocked' });
        }
        return done(null, user);

    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    userServices.findById(id).then((user) => {
        done(null, user);
    });
});

module.exports = passport;