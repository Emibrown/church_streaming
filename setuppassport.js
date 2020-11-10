var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var User = require('./models/user');


module.exports = function(){
    passport.serializeUser(function(user, done){
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            if(err) done(err);
            if(user){
                done(null, user);
            } 
        });
    });
    
};

passport.use('admin-local', new localStrategy({
    usernameField: 'email'
},
    function(username, password, done){
        User.findOne({email: username}, function(err, user){
            if(err){return done(err);}
            if(!user){
                return done(null, false,
                 {message: "No user has that email!"});
            }
            if(user.type != 1){
                return done(null, false, { message: 'Invalied Admin account.' });
            }
            user.comparePassword(password, function(err, isMatch) {
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: 'Incorrect password.' });
              }
            });
        });
    }
));

passport.use('user-local', new localStrategy({
    usernameField: 'email'
},
    function(username, password, done){
        User.findOne({email: username}, function(err, user){
            if(err){return done(err);}
            if(!user){
                return done(null, false,
                 {message: "No user has that email!"});
            }
            user.comparePassword(password, function(err, isMatch) {
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: 'Incorrect password.' });
              }
            });
        });
    }
));

