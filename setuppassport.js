var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
var User = require('./models/user');
var oAuth = require('./config/oAuth');


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
        clientID: oAuth.facebookOAuth.clientID,
        clientSecret: oAuth.facebookOAuth.clientSecret,
        callbackURL: oAuth.facebookOAuth.callbackURL,
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
                         newUser.firstname = profile.name.givenName;
                         newUser.lastname = profile.name.familyName;
                         newUser.email = profile.emails[0].value;
                
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


//   passport.use(new GoogleStrategy({
//     clientID:     GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://yourdomain:3000/auth/google/callback",
//     passReqToCallback   : true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));

