const express = require('express');
const Category = require('../models/category');
const Video = require('../models/video');
const Advert = require('../models/advert');
const PrayerRequest = require('../models/prayerRequest');
const Programmer = require('../models/programmer');
const User = require('../models/user');
const Proposal = require('../models/showProposal');
const Testimony = require('../models/testimony');
const MusicVideo = require('../models/musicVideo');
const Enquiry = require('../models/enquiries');
const Partnership = require('../models/patnership');
const Schedule = require('../models/schedule');
const About = require('../models/about');
const Settings = require('../models/settings');
const RequestPassword = require('../models/requestPassword');
const Comment = require('../models/comments');
const bcrypt = require('bcryptjs')
const passport = require('passport');
const {customEmail} = require('../services/email');
const moment = require('moment');
const Feedback = require('../models/enquiries');
const MusicGenre = require('../models/musicGenres');
const AdminTestimony = require('../models/adminTestimony');
const router = express.Router();

router.use(async(req, res, next) => {
  res.locals.moment = moment;
  res.locals.currentUser = req.user;
  res.locals.allAbout = await About.find({})
  res.locals.settings = await Settings.findOne({settingsId:"site_settings"})
  next();
});

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
      res.redirect('/profile');
  }else {
     next();
  }
};

const ensureAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/login");
  } else {
    next();
  }
};

const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

router.get("/auth/facebook", passport.authenticate("facebook", {scope: "email"}));

router.get("/register/auth/facebook", passport.authenticate("facebook", {scope: "email"}));

router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect:"/edit-profile",
  failureMessage:"/login",
}));


/* GET home page. */
router.get('/', async (req, res, next) => {
  const schedules = await Schedule.find(
    { 
      startTime: {$gte: new Date(new Date().setHours(00, 00, 00))},
    }
  )
  .populate('show')
  .sort({startTime: 'asc'}) 

  const highlight = await Schedule.find(
    { 
      startTime: {$gte: new Date()},
    }
  )
  .populate('show')
  .sort({startTime:1}) 
  .limit(2)

  const latestVideos = await Video.find(
    {
      type: { $ne: '1' }
     }
  ).populate('programme')
  .sort({startTime:1}) 
  .limit(4)

  

  await Video.aggregate([
    { $match: 
      { 
        type: { $ne: '1' }
      } 
    },
  
    {
        $lookup:
                    {
                        from:"favourites",
                        localField:"_id",
                        foreignField:"video",
                        as:"favouriteVideos"
                    }
    },
    {
        $project:{
                _id:1,
               views:1,
               image:1,
               title:1,
               code:1,
               addedOn:1,
                favouriteCount:{$size:"$favouriteVideos"},
            }
    },
    {
        $sort : {favouriteCount : 1,views:1,addedOn:1}
    },
    {
        $limit : 10
    }
    ])
    .exec(function(err, trendingVideos) {
      console.log(trendingVideos)
      res.render('users/pages/index', { title: 'Home',schedules,highlight,latestVideos,trendingVideos });

    });

   

 

  // const streams = await Video.aggregate([
  //   { 
  //     $match: 
  //     { 
  //       startTime: {$gte: new Date(new Date().setHours(00, 00, 00))}
  //     } 
  //   },
  //   {
  //       $project : {
  //           title : 1,
  //           description : 1,
  //           image: 1,
  //           type: 1,
  //           doneStreaming: 1,
  //           streamKey: 1,
  //           scheduledOn: 1,
  //           difference : {
  //               $abs : {
  //                   $subtract : [new Date(new Date().setHours(00, 00, 00)), "$scheduledOn"]
  //               }
  //           }
  //       }
  //   },
  //   {
  //       $sort : {difference : 1}
  //   },
  //   {
  //       $limit : 3
  //   }
  //   ])

});

router.get('/categories', (req, res, next) => {
  res.render('users/pages/cats', { title: 'Faith TV | Categories' });
});

router.get('/about/:code', async(req, res, next) =>{
  const about = await About.findOne(
    { 
      code: req.params.code,
    }
  )
  if(about){
    res.render('users/pages/about', { title: 'Faith TV | About', about });
  }else{
    res.redirect("/")
  }
});

// router.get('/dayview', (req, res, next) =>{
//   res.render('users/pages/dayview', { title: 'Day View' });
// });

// router.get('/schedule', (req, res, next) =>{
//   res.render('users/pages/schedule', { title: 'Faith TV | Schedule' });
// });

// router.get('/highlights', (req, res, next) =>{
//   res.render('users/pages/high', { title: 'Faith TV | Highlights' });
// });

router.get('/show-proposal',  async(req, res, next) =>{
  const genres = await MusicGenre.find({});
  res.render('users/pages/show_proposal', { title: 'Faith TV | Submit Show Proposal', genres });
});

router.get('/music-video', async(req, res, next) =>{
  const genres = await MusicGenre.find({});
  res.render('users/pages/music_video', { title: 'Faith TV | Submit Music Video',  genres});
});

router.get('/become-programmer', (req, res, next) =>{
  res.render('users/pages/become_programmer', { title: 'Faith TV | Become a Programmer' });
});
router.get('/advertise', (req, res, next) =>{
  res.render('users/pages/advert', { title: 'Faith TV | Advertise' });
});
router.get('/salvation-prayer', (req, res, next) =>{
  res.render('users/pages/salvation', { title: 'Faith TV | Salvation Prayer' });
});
router.get('/prayer-request', (req, res, next) =>{
  res.render('users/pages/prayer_req', { title: 'Faith TV | Prayer Request' });
});
router.get('/testimony', (req, res, next) =>{
  res.render('users/pages/testimony', { title: 'Faith TV | Share Your Testimony' });
});
router.get('/watch-testimonies', async(req, res, next) =>{
  const testimonies = await AdminTestimony.find({});
  res.render('users/pages/watch_testimonies', { title: 'Faith TV | Watch Testimonies', testimonies });
});
router.get('/contact', (req, res, next) =>{
  res.render('users/pages/contact', { title: 'Faith TV | Contact' });
});
router.get('/enquiries', (req, res, next) =>{
  res.render('users/pages/enquiries', { title: 'Faith TV | Enquiries' });
});
router.get('/partnership', (req, res, next) =>{
  res.render('users/pages/partnership', { title: 'Faith TV | Partnership' });
});

router.get('/members-only', ensureAuthenticated, async(req, res, next) =>{
  res.render('users/pages/members_only', { title: 'Faith TV | Members Only'});
});

router.get('/register', authenticated, (req, res, next) =>{
  res.render('users/pages/register', { title: 'Faith TV | Register' });
});
router.get('/login', authenticated, (req, res, next) =>{
  res.render('users/pages/login', { title: 'Faith TV | Login' });
});

router.get('/change-password', ensureAuthenticated, (req, res, next) =>{
  res.render('users/pages/change_password', { title: 'Faith TV | Change password' });
});
router.get('/edit-profile', ensureAuthenticated, (req, res, next) =>{
  res.render('users/pages/edit_profile', { title: 'Faith TV | Edit Profile', user:req.user });
});

router.get('/my-profile', (req, res, next) =>{
  res.render('users/pages/my_profile', { title: 'Faith TV | User Dashboard' });
});

router.get('/forgot', authenticated, (req, res, next) =>{
  res.render('users/pages/forgot', { title: 'Faith TV | Forgot Password' });
});

router.get('/reset-password/:id', authenticated, (req, res, next) =>{
  res.render('users/pages/reset_password', { title: 'Faith TV | Password Reset' });
});

// user login
router.post('/login', authenticated, (req, res, next) => {
  passport.authenticate('user-local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      sendJSONresponse(res, 400, info);
      return;
    }
    req.logIn(user, function(err) {
        if (err) { return next(err); }
        sendJSONresponse(res, 200, {"message": "Login successfull please wait..."});
        return;
    });
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});


/** GET requests for pages ends here **/

router.get('/live/:id', async(req, res, next) => {
  const video = await Video.findOne(
    { 
      _id: req.params.id,
    }
  )
  res.render('users/pages/video_live', { title: 'Streaming details',video });
});

router.get('/cat/:id', async(req, res, next) => {
  const category = await Category.findOne(
    { 
      _id: req.params.id,
    }
  )
  const videos = await Video.find(
    { 
      category: req.params.id,
    }
  )
  res.render('users/pages/cats', { title: 'Category details',category,videos });
});

router.get('/video/:id', async(req, res, next) => {
  const video = await Video.findOne(
    { 
      _id: req.params.id,
    }
  )
  res.render('users/pages/video_details', { title: 'Video details',video });
});

router.get('/get_comment',  ensureAuthenticated, async (req, res, next) => {
  try {
      const comments = await Comment.find({}).sort({date: 'descending'}).populate('user');
      return res.status(200).send(comments);
     
  } catch (error) {
    res.status(404).send({msg: error.message})
  }
});

router.get('/get_recent_comment/:id',  ensureAuthenticated, async (req, res, next) => {

  try {
      const {counter} = await Comment.findOne({_id: req.params.id});
      const newComment = await Comment.find({"counter" : { $gt: counter}}).sort({date: 'descending'}).populate('user');
      if(newComment.length > 0){
        return res.status(200).send(newComment)
      }
    
    } catch (error) {
      return res.status(404).send({msg: error.message})
    }

});

//advert routes
router.post('/create_advert', async (req, res, next) => {
  //  submit a programmer request
  try {
      console.log(req.body);
      const {fullName :user_name, email:user_email} = req.body;
      const header = "";
      const message = "Request to submit advert has been delivered successfully";
      const advert = new Advert(req.body)
      const saveAdevert = await advert.save()
      if(saveAdevert){
        customEmail(user_name, user_email, header, message);
        res.send({status: 200, message: 'Advert was created successfully'});
      }
      res.send({status:400, message: 'Failed to process. Please ensure all fields are filled correctly'});

  } catch (error) {
    sendJSONresponse(res, 400, Object.keys(error.errors));
  }
});

//prayerRequest routes
router.post('/prayer_request', async (req, res, next) => {
    try {
        const {fullName, email} = req.body;
        const header = "";
        const message = "Your prayer request was sent successfully";
        const prayerRequest = new PrayerRequest(req.body)
        const savePrayer = await prayerRequest.save();
        if(savePrayer){
           customEmail(fullName, email, header, message);
           res.send({status: 200, message: 'Prayer Request Submitted'});
         }
    } catch (error) {
      sendJSONresponse(res, 400, Object.keys(error.errors));
    }
});

//programmer routes
router.post('/become_programmer', async (req, res, next) => {
    //  submit a programmer request
    try {
        console.log(req.body);
        const {fullName, email} = req.body;
        const header = "";
        const message = "Request to submit programme content was successful";
        const programmer = new Programmer(req.body);
        const saveProgrammer = await programmer.save()
        if(saveProgrammer){
          customEmail(fullName, email, header, message);
          res.send({status: 200, message: 'programmer request submitted successfully'});
        }
    } catch (error) {
      sendJSONresponse(res, 400, Object.keys(error.errors));
    }
});
//user registration 
router.post( '/register', async (req, res, next) =>{
  try {
    const {firstname:name, email} = req.body;
    const capitalizer = string =>  string && string.charAt(0).toUpperCase() + string.substring(1);
    const firstName = capitalizer(name);
    const header = "Congratulations!!";
    const message = "Your Registration was successful";
    const user = new User(req.body);
    const newUser = await user.save();
    if(newUser){
      customEmail(firstName, email, header, message);
      req.logIn(user, function(err) {
        if (err) { return next(err); }
         res.send({status:200, message: "Registration was successful"});
      })
    }    
  }catch (error) {
    console.log(error);
    sendJSONresponse(res, 400, Object.keys(error.errors));
  }
});

//user login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      sendJSONresponse(res, 400, info);
      return;
    }
    req.logIn(user, function(err) {
        if (err) { return next(err); }
        sendJSONresponse(res, 200, {"message": "Login successfull please wait..."});
        return;
    });
  })(req, res, next);
});

//request password
router.post('/request_password', async(req, res, next) =>{

  try{
    const email = req.body.email;
    const host = req.get('host');
    const getUser = await User.findOne({email});  
    if(getUser){
      const token = Math.floor(100000 + Math.random() * 900000); 
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const header = "Password Change!!";
      const message = `<h3> Please follow this link to reset your password</h3>: 
      <p><a href="https://${host}/reset-password/${getUser._id}">Click to reset now </a> </p>`;
       
       const requestPassword = new RequestPassword({
        userId: getUser._id,
        email,
        ip,
        token,
      });
      const saveData = await requestPassword.save();
      
      if(saveData){
        customEmail(getUser.firstname, email, header, message);
        res.send({status: 200, message: `Mail contaning password information has been sent to  ${email}`});
      }else{
         res.status(404).send({message: "failed to save request data"})
      }
    }else{
      res.status(404).send({message: "Email provided does not exist. Please kindly register"})
    }
  }catch(error){
    res.status(404).send({msg: error.message})
  }
});

// update password
router.post('/update_password',  async(req, res, next) => {
  try{
   const {password, user_id}  = req.body;
   const getRequester = await RequestPassword.findOne({userId: user_id, });
   if(getRequester){
    const now = new Date();
    const previous = new Date(getRequester.tokenTime)
    const difference = previous > now ? previous - now : now - previous
    const diff_min = Math.floor(difference/(1000*60))
    if (diff_min <= 5) {
      await User.updateOne(
        { _id: user_id },
        { $set:
           {
             password : await bcrypt.hash(password, 8)
            
           }
        }
     );
    await RequestPassword.deleteOne( { token: getRequester.token } )
    return res.status(200).send({status:200, message: "Password was changed successfully"})
    }else{
     await RequestPassword.deleteOne( { token: getRequester.token } )
     return res.status(400).send({msg: "Password reset link is expired. Please request new"})
  }
  }else{
    return res.status(400).send({msg: "Cannot find details please request new"})
  }
  }catch(error){
    res.status(404).send({msg: error.message})
  }
});

// change password
router.put('/change_password', ensureAuthenticated, async(req, res, next) => {
  try{
   const {userId, previous, password} = req.body;
 
   const userGet = await User.findOne({_id: userId})
   console.log(userGet);
   console.log(userGet.password);
   if(await bcrypt.compare(previous, userGet.password)){
    await User.updateOne(
      { _id: userId },
      { $set:
         {
           password : await bcrypt.hash(password, 8)
          
         }
      }
   );
    return res.status(200).send({status:200, message: "Password was changed successfully"})
   }else{
    return res.status(404).send({status:400, msg: "Previous password is incorrect"})
   }
  }catch(error){
    console.log
    res.status(404).send({msg: error.message})
  }
});

// update user profile both facebook and local
router.put('/update_profile', ensureAuthenticated, async(req, res) =>{
  try{
   
      const {userId, firstname, lastname, 
      middlename, dateOfBirth, location, address, LGA,
      email, chapterLocation, residentPastor, organisationName } = req.body;
      const capitalizer = string =>  string && string.charAt(0).toUpperCase() + string.substring(1);

      const emailClean = email.trim();
      const firstClean = capitalizer(firstname);
      const lastClean = capitalizer(lastname);
      const middleClean = capitalizer(middlename);
  
      await User.findOneAndUpdate(
      { 
          "_id": userId
      },
      { 
          $set: { 
            firstname:firstClean, 
            lastname:lastClean,
            middlename: middleClean, 
            dateOfBirth, 
            location, 
            address, 
            LGA, 
            email:emailClean,
            chapterLocation,
            residentPastor,
            organisationName,

          }
      },
      { new: true, useFindAndModify: false},
      (err, data) => {
          if (!err)
            return res.status(200).send({status:200, message: "Records updated successfully"});
              //res.json(data);
          else{
            return res.status(400).send({msg: "Operation was unsuccessful"});
              //res.json(err);
          }
      }
  );

  }catch(error){
    console.log(error);
    res.status(404).send({msg: error.message})
  }
});


router.post('/post_comment', ensureAuthenticated, async(req, res) =>{
  try{
    if(!req.body)
     return res.status(404).send({ msg: "empty data set" })
      const comment = new Comment(req.body);
      const newComment = await comment.save();
    if(newComment)
     return res.status(200).send({status: 200, message:"Comment was sent successfully"});
    else{
      return res.status(400).send({status: 400, message: "failed to process"});
    }
  }catch(error){
    console.log(error);
    res.status(404).send({ msg: error.message });
  }

});


//show proposal routes
router.post('/show_proposal', ensureAuthenticated, async (req, res, next) => {
    // create a proposal
    try{
        const {supplierName, email} = req.body;
        const header = "show proposal";
        const message = "Request was processed successfully";
        customEmail(supplierName, email, header, message);
        const proposal = new Proposal(req.body)
        console.log(proposal)
        await proposal.save()
        res.send({status: 200, message: 'show proposal submitted'});
    }catch(error) {
      sendJSONresponse(res, 400, Object.keys(error.errors));
    }
});

//testimonies routes
router.post('/testimony', ensureAuthenticated, async (req, res, next) => {
    // create a testimony
    try {
        const {fullName, email} = req.body;
        const header = "Testimony";
        const message = "Request was processed successfully";
        customEmail(fullName, email, header, message);
        const testimony = new Testimony(req.body)
        await testimony.save()
        res.send({status: 200, message: 'Testimony submitted'});
    } catch (error) {
      sendJSONresponse(res, 400, Object.keys(error.errors));
    }
});

//music video routes
router.post('/music_video', ensureAuthenticated, async (req, res, next) => {
    // submit music video
    try {
        const {fullName, email} = req.body;
        const header = "";
        const message = "Request to submit music video was sent successfully";
        customEmail(fullName, email, header, message);
        const musicVideo = new MusicVideo(req.body);
        await musicVideo.save();
        res.send({status: 200, message: 'music video submitted'});
    } catch (error) {
      sendJSONresponse(res, 400, Object.keys(error.errors));
    }
});

//feedback routes
router.post('/enquiries', ensureAuthenticated, async (req, res, next) => {
  // submit feedback
  try {
      const {fullName, email} = req.body;
      const header = "feeback / enquiry";
      const message = "Request was processed successfully";
      customEmail(fullName, email, header, message);
      const enquiry = new Enquiry(req.body);
      await enquiry.save();
      res.send({status: 200, message: 'feedback submitted'});
  } catch (error) {
    sendJSONresponse(res, 400, Object.keys(error.errors));
  }
});

//patnership routes
router.post('/patnership', async(req, res, next) => {
  // submit a patnership form
  try {
    if(!req.body){
      return res.status(404).send({ msg: "empty data set" })
    }
    const {firstName, email} = req.body;
    const patnership = new Partnership(req.body);
    const saved = await patnership.save();
    if(saved){
      const header = "";
      const message = "Your partnership Request was processed successfully";
      customEmail(firstName, email, header, message);
     return res.status(200).send({status: 200, message: 'patnership form submitted'});
    }
  } catch (error) {
    sendJSONresponse(res, 400, Object.keys(error.errors));
  }
});
module.exports = router;
