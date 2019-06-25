const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Admin = require('../model/admin.model');
const User = require('../model/user.model');
const config = require('../config/database');

//To authenticate the User by JWT Strategy

module.exports = (req, userType, passport) => {

    let opts = {};

    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');

    opts.secretOrKey = config.secret;

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

        if (userType == 'admin') {
            Admin.getAdminById(jwt_payload.data._id, (err, user) => {
                if (err) return done(err, false);
                if (user) return done(null, user);
                return done(null, false);
            });
        }

        if (userType == 'users') {
            User.getUserById(jwt_payload.data._id, (err, user) => {
                if (err) return done(err, false);
                if (user) {
                    return done(null, user);
                }

                if (req.route.path == '/') {
                    Admin.getAdminById(jwt_payload.data._id, (err, user) => {
                        if (err) return done(err, false);
                        if (user) {
                            req.role = "admin";
                            return done(null, user);
                        }
                        return done(null, false);
                    });

                } else if (req.route.path == '/:id') {
                    Admin.getAdminById(jwt_payload.data._id, (err, user) => {
                        if (err) return done(err, false);
                        if (user) {
                            req.role = "admin";
                            return done(null, user);
                        }
                        return done(null, false);
                    });

                } else {
                    return done(null, false);
                }
            });
        }
    }));
}