const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Users = mongoose.model('Users');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, (email, password, done) => {
    Users.findOne({email})
        .then((user) => {

            if (!user) {
                return done(null, false, {errors: {'email': `User doesn't exist.`}});
            }

            if (!user.validatePassword(password)) {
                return done(null, false, {errors: {'password': 'wrong credentials'}});
            }

            return done(null, user);
        }).catch(done);
}));