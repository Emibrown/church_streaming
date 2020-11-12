var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
var User = require('./models/user');
var facebookAuth = require('./config/facebookAuth');


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
                return done(null, false, { message: 'Invalid Admin account.' });
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
                 {message: "Email supplied does not exist!"});
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

passport.use(
    new FacebookStrategy(
      {
        clientID: facebookAuth.oAuth.clientID,
        clientSecret: facebookAuth.oAuth.clientSecret,
        callbackURL: facebookAuth.oAuth.callbackURL,
        profileFields: ["email", "name"]
      },
       //sends back token and profile
      function(accessToken, refreshToken, profile, done) {
         process.nextTick(function(){
            User.findOne({"facebookId":profile.id}, function(err, user){
                 if(err) return done(err)
                 if(user)return done(null, user)
                    else{
                        const newUser = new User();
                         newUser.facebookId = profile.id;
                         newUser.facebookToken = accessToken;
                         newUser.facebookNames = profile.name.givenName + ' '+ profile.name.familyName;
                         newUser.facebookEmail = profile.emails[0].value;
                
                 newUser.save(function(err){
                      if(err)
                        throw err;
                        return done(null, newUser);
                  })        
                }
             })

         });
      }
    )
  );

