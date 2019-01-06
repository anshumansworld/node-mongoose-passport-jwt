const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
const mongoose = require('mongoose');
const Users = mongoose.model('Users');

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
    const user = req.body;

    if (!user.email) {
        return res.status(406).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(406).json({
            errors: {
                password: 'is required',
            },
        });
    }

    return passport.authenticate('local', {session: false}, (err, passportUser, info) => {
        if (err) {
            return next(err);
        }

        if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return res.json({user: user.toAuthJSON()});
        }

        return res.status(400).json(info);
    })(req, res, next);
});

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
    const user = req.body;

    if (!user.email) {
        return res.status(406).json({
            errors: {
                email: 'is required',
            },
        });
    }

    if (!user.password) {
        return res.status(406).json({
            errors: {
                password: 'is required',
            },
        });
    }

    if (!user.firstName) {
        return res.status(406).json({
            errors: {
                firstName: 'is required',
            },
        });
    }

    if (!user.lastName) {
        return res.status(406).json({
            errors: {
                lastName: 'is required',
            },
        });
    }

    if (!user.gender) {
        return res.status(406).json({
            errors: {
                gender: 'is required',
            },
        });
    }

    const finalUser = new Users(user);

    finalUser.setPassword(user.password);

    return Users.findOne({email: finalUser.email})
        .then((user) => {
            if (user) {
                return res.status(406).json({
                    errors: {
                        email: 'This email is already registered',
                    },
                });
            }
            finalUser.save()
                .then(() => res.json({user: finalUser.toAuthJSON()}));
        }).catch(next);
});

//GET profile route (optional, everyone has access)
router.get('/', auth.required, (req, res, next) => {
    const user = req.payload;
    Users.findOne({_id: user.id})
        .then((user) => {
            res.json({user: user.toUserModel()});
        }).catch(next);
});

module.exports = router;
