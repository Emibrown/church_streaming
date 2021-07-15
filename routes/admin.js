const express = require('express');
const Advert = require('../models/advert');
const User = require('../models/user');
const Category = require('../models/category');
const Video = require('../models/video');
const Visit = require('../models/visit');
const Settings = require('../models/settings');
const About = require('../models/about');
const Programme = require('../models/programme');
const Schedule = require('../models/schedule');
const Season = require('../models/season');
const SendMessage = require('../models/sendMessage');
const MusicGenre = require('../models/musicGenres');
const AdminTestimony = require('../models/adminTestimony');
const passport = require('passport');
const multers = require('../middleware/multers')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra');   
const moment = require('moment');
const shortid = require('shortid');
const customEmail = require('../services/email');
const { Session } = require('inspector');
const router = express.Router();
const {v4:uuid} = require('uuid');
const MusicVideo = require('../models/musicVideo');
const Programmer = require('../models/programmer');
const Testimony = require('../models/testimony');
const PrayerRequest = require('../models/prayerRequest');
const Enquiry = require('../models/enquiries');
const Patnership = require('../models/patnership');
const Favourite = require('../models/favourite');
const Watch = require('../models/watch');
const History = require('../models/history');
const Member = require('../models/membership');

const helpers = require('../helpers/helpers');
const {checkLevelThreeAcess, checkLevelOneAccess, checkLevelTwoAcess} = require('../helpers/restrictions');

const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

const uploadPath = path.join(__dirname, '../public/uploads/'); // Register the upload path
fse.ensureDir(uploadPath); // Make sure that he upload path exits


const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    if(req.user.type == 1){
      res.redirect('/admin/dashboard');
    }else{
      next();
    }
  }else {
    next();
  }
};

const ensureAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/admin");
  } else {
    if(req.user.type != 1){
      res.redirect('/');
    }
    next();
  }
};

User.find({}, (err, users) => {
  if(err){ return;}
  if(users.length == 0){
    var newUser = new User({
      firstname: "Admin",
      lastname: "Admin",
      middlename: "Admin",
      title:'Mr',
      email: "admin@gmail.com",
      password: "11223344E",
      address:"Port Harcourt",
      location: "Port",
      stateOfOrigin: 'Ph',
      LGA: "ph",
      residentPastor: "Pastor John",
      chapterLocation: "Rumuibekwe",
      organisationName: "Coders",
      type: 1,
      isBlocked: false,
      dateOfBirth: "1967-02-19",
    });
    newUser.save((err, user) => {
      if (err) { 
        console.log(err);
        return; 
      }else{
          console.log(user);
      }
    });
  }
})

const getMonthDateRange = (year, month) => {
  var moment = require('moment');

  // month in moment is 0 based, so 9 is actually october, subtract 1 to compensate
  // array is 'year', 'month', 'day', etc
  var startDate = moment([year, month - 1]);

  // Clone the value before .endOf()
  var endDate = moment(startDate).endOf('month');

  // just for demonstration:
  console.log(startDate.toDate());
  console.log(endDate.toDate());

  // make sure to call toDate() for plain JavaScript date type
  return { start: startDate, end: endDate };
}


Settings.find({}, (err, settings) => {
  if(err){ return;}
  if(settings.length == 0){
    var newSettings = new Settings({
      settingsId: "site_settings",
      publicStreamKey: shortid.generate(),
      memberStreamKey: shortid.generate()
    });
    newSettings.save((err, settings) => {
      if (err) { 
        console.log(err);
        return; 
      }else{
          console.log(settings);
      }
    });
  }
})

router.use((req, res, next) => {
  res.locals.moment = moment;
  res.locals.currentUser = req.user;
  next();
});


function getMessage() {
	return( Promise.resolve("Streaming sent to facebook...") );
}


/* GET home page. */
router.get('/',authenticated, (req, res, next) => {
  res.render('admin/pages/login', { title: 'Login' });
});

router.get('/social_media_streaming',ensureAuthenticated, checkLevelThreeAcess, (req, res, next) => {
  res.render('admin/pages/social_media_streaming', { title: 'Social media streaming' });
});



// facebookstream

router.post('/facebookstream',ensureAuthenticated, (req, res, next) => {
  getMessage()
			.then(
				( message ) => {
          // Close the client response.
          try {
            if(facebookrtmpspid){
             process.kill(facebookrtmpspid)
            }
            console.log('facebookstream stoped');
           } catch (error) {
            console.error('error');
           }
          sendJSONresponse(res, 200, message);
				}
			)
			.then( async( ) => {
        // Close the client response.
        const setting = await Settings.findOne({settingsId:"site_settings"})
        helpers.fbRtmp(req.body.fb,setting.publicStreamKey)

      } )
});

router.post('/ytstream',ensureAuthenticated, (req, res, next) => {
  getMessage()
			.then(
				( message ) => {
          // Close the client response.
          try {
            if(ytrtmpspid){
             process.kill(ytrtmpspid)
            }
            console.log('ytstream stoped');
           } catch (error) {
            console.error('error');
           }
          sendJSONresponse(res, 200, "Youtube streaming ended");
				}
			)
			.then( async ( ) => {
        const setting = await Settings.findOne({settingsId:"site_settings"})
        // Close the client response.
        helpers.ytRtmp(req.body.yt,setting.publicStreamKey)

      } )
});



router.post('/login', (req, res, next) => {
  passport.authenticate('admin-local', function(err, user, info) {
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
  res.redirect('/admin');
});

router.get('/dashboard', ensureAuthenticated, async(req, res, next) => {
  const members = await User.find({});
  const programmes = await Programme.find({});
  const videos = await Video.find({});
  const start = moment().startOf('day'); // set to 12:00 am today
  const end = moment().endOf('day'); // set to 23:59 pm today
  const startw = moment().startOf('week'); // set to 12:00 am today
  const endw = moment().endOf('week'); // set to 23:59 pm today
  const startm = moment().startOf('month'); // set to 12:00 am today
  const endm = moment().endOf('month'); // set to 23:59 pm today
  const visit = await Visit.find({date: {$gte: start, $lt: end}});
  const visitw = await Visit.find({date: {$gte: startw, $lt: endw}});
  const visitm = await Visit.find({date: {$gte: startm, $lt: endm}});
  res.render('admin/pages/index', { title: 'Dashboard', members, programmes, videos, visit,visitw,visitm });
});

router.post('/dashboard', ensureAuthenticated, async(req, res, next) =>{
  const month = req.body.month
  const year = req.body.year
  const monthName = moment(month).format('MMMM') 
  const date = new Date(year, month-1)
  const startms = moment(date).startOf('month')
  const endms = moment(date).endOf('month')
  const visitc = await Visit.count({date: {$gte: startms, $lt: endms}})
  const visitCustom = {
    monthName: monthName,
    year : year,
    visitc : visitc
  }
console.log(visitCustom)
  sendJSONresponse(res, 200, visitCustom)

});

router.get('/stop_streaming', ensureAuthenticated, async(req, res, next) => {
   try {
     if(localpid){
      process.kill(localpid)
     }
     if(facebookpid){
        process.kill(facebookpid)
      }
      if(youtubepid){
         process.kill(youtubepid)
      }
      if(twitterpid){
          process.kill(twitterpid)
      }
      if(facebookrtmpspid){
          process.kill(facebookrtmpspid)
      }
      if(ytrtmpspid){
          process.kill(ytrtmpspid)
      }
      console.log('streaming stoped');
    } catch (error) {
        console.error(error);
        // return error.code === 'EPERM';
    }
    sendJSONresponse(res, 200, {message: 'Streaming ended on all platforms'});
});

router.get('/stop_facebookstream', ensureAuthenticated, async(req, res, next) => {
  try {
    if(facebookrtmpspid){
     process.kill(facebookrtmpspid)
    }
     console.log('facebookstream stoped');
   } catch (error) {
       console.error(error);
       // return error.code === 'EPERM';
   }
   sendJSONresponse(res, 200, {message: 'Streaming ended'});
});

router.get('/stop_ytstream', ensureAuthenticated, async(req, res, next) => {
  try {
    if(ytrtmpspid){
     process.kill(ytrtmpspid)
    }
     console.log('ytstream stoped');
   } catch (error) {
       console.error(error);
       // return error.code === 'EPERM';
   }
   sendJSONresponse(res, 200, {message: 'Streaming ended'});
});

// settings/site details
router.get('/site-details', ensureAuthenticated, checkLevelOneAccess, async(req, res, next) => {
  const settings = await Settings.findOne({settingsId:"site_settings"})
  res.render('admin/pages/site_details', { title: 'Admin | Site Details', settings });
});

router.get('/send-message/:id', ensureAuthenticated, async(req, res, next) => {
  const getUser = await User.findOne({_id:req.params.id})
  res.render('admin/pages/send_message', { title: 'Admin | Send Message', getUser });
});

router.get('/salvation-prayer', ensureAuthenticated, checkLevelOneAccess, async(req, res, next) => {
  const settings = await Settings.findOne({settingsId:"site_settings"})
  res.render('admin/pages/salvation_prayer', { title: 'Salvation Prayer', settings });
});

router.get('/add_about', ensureAuthenticated,  async(req, res, next) => {
  res.render('admin/pages/add_about', { title: 'Add About' }); 
});

router.get('/streaming', ensureAuthenticated, checkLevelThreeAcess, async(req, res, next) => {
  const settings = await Settings.findOne({settingsId:"site_settings"})
  res.render('admin/pages/streaming', { title: 'Streaming settings', settings }); 
});

router.get('/edit_about', ensureAuthenticated, async(req, res, next) => {
  const about = await About.findOne({_id:req.query.id})
  res.render('admin/pages/edit_about', { title: 'Edit About', about });
});

// settings/static files
router.get('/add_static', ensureAuthenticated, async(req, res, next) => {
  res.render('admin/pages/add_static',{ title: 'Add static files',  });
});

// manage users/socialmedia
router.get('/social-media', ensureAuthenticated, checkLevelOneAccess, async(req, res, next) => {
  const settings = await Settings.findOne({settingsId:"site_settings"})
  res.render('admin/pages/social_media', { title: 'Social Media', settings });
});

// manage users/view users
router.get('/view-users', ensureAuthenticated, checkLevelTwoAcess, async(req, res, next) => {
  const users = await User.find({type:0})
  res.render('admin/pages/view_users', { title: 'View Users', users });
});

router.get('/view-members', ensureAuthenticated, checkLevelTwoAcess, async(req, res, next) => {
  const users = await User.find({isMember:true})
  res.render('admin/pages/view_members', { title: 'View Members', users });
});



router.get('/membership-request', ensureAuthenticated, checkLevelTwoAcess, async(req, res, next) => {
  const MemberRequest = await Member.find({}).populate("member")
  res.render('admin/pages/membership-request', { title: 'Membership Request', MemberRequest });
});


router.get('/view-admins', ensureAuthenticated, checkLevelOneAccess, async(req, res, next) => {
  const admins = await User.find({type: { $ne: 0 }})
  res.render('admin/pages/view_admins', { title: 'View Admins', admins });
});

router.get('/view-single/:id', ensureAuthenticated, async(req, res, next) => {
  const user = await User.findById({_id: req.params.id})
  const favorites = await Favourite.find({ member: user._id}).populate('video')
  const history = await History.find({ member: user._id}).populate('video')
  const watch = await Watch.find({ member: user._id}).populate('video')
  console.log(favorites)
  res.render('admin/pages/view_single_user', { title: 'View Single User', user , favorites, history, watch});
});

router.get('/view-single-admin/:id', ensureAuthenticated, async(req, res, next) => {
  const adminUser = await User.findById({_id: req.params.id})
  res.render('admin/pages/view_single_admin', { title: 'View Single Admin', adminUser });
});

router.get('/view-admin-testimonies', ensureAuthenticated, checkLevelTwoAcess, async (req, res, next) => {
  // Get  all proposals 
  try {
      const testimonies = await AdminTestimony.find({})
      res.render('admin/pages/view_admin_testimonies', { title: 'All Testimonies', testimonies });
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});


//update sit settings from admin page
router.put('/settings', ensureAuthenticated, async (req, res, next) => {
  try {
      const settings = await Settings.findOne({settingsId:"site_settings"})
      await Object.assign(settings, req.body);
      console.log(settings)
      await settings.save()
      res.send({status: 200, message: 'Settings saved'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.put('/update_proposal/:id', ensureAuthenticated, async (req, res, next) => {
  // site settings
  try {
      const newProposal = await Proposal.findOne({_id:req.params.id})
       console.log(newProposal);
      await Object.assign(newProposal, req.body);
      await newProposal.save()
      res.send({status: 200, message: 'Proposal updated successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.put('/update_advert/:id', ensureAuthenticated, async (req, res, next) => {
  try {
      const newAdvert = await Advert.findOne({_id:req.params.id})
      await Object.assign(newAdvert, req.body);
      await newAdvert.save()
      res.send({status: 200, message: 'Advert updated successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});


router.put('/update_music_video/:id', ensureAuthenticated, async (req, res, next) => {
  
  try {
      const newMusicVideo = await MusicVideo.findOne({_id:req.params.id})
      await Object.assign(newMusicVideo, req.body);
      await newMusicVideo.save()
      res.send({status: 200, message: 'Music Video updated successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.put('/update_genre/:id', ensureAuthenticated, async (req, res, next) => {
  
  try {
      const newGenre = await MusicGenre.findOne({_id:req.params.id})
      await Object.assign(newGenre, req.body);
      await newGenre.save()
      return res.send({status: 200, message: 'Music genre updated successfully'});
  } catch (error) {
    console.log(error)
    return res.status(404).send({ msg: error.message });
  }
});

router.put('/update_content_developer/:id', ensureAuthenticated, async (req, res, next) => {

  try {
      const newContentDev = await Programmer.findOne({_id:req.params.id})
      await Object.assign(newContentDev, req.body);
      await newContentDev.save()
      res.send({status: 200, message: 'Content Developer updated successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.put('/update_testimony/:id', ensureAuthenticated, async (req, res, next) => {

  try {
      const testimony = await Testimony.findOne({_id:req.params.id})
      await Object.assign(testimony, req.body);
      await testimony.save()
      res.send({status: 200, message: 'Testimony Updated Successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.put('/update_admin_testimony/:id', ensureAuthenticated, async (req, res, next) => {

  try {
      const testimony = await AdminTestimony.findOne({_id:req.params.id})
      await Object.assign(testimony, req.body);
      await testimony.save()
      res.send({status: 200, message: 'Testimony Updated Successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.put('/update_prayerRequest/:id', ensureAuthenticated, async (req, res, next) => {

  try {
      const prayerRequest = await PrayerRequest.findOne({_id:req.params.id})
      await Object.assign(prayerRequest, req.body);
      await prayerRequest.save()
      res.send({status: 200, message: 'Prayer Request Updated Successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.put('/update_enquiry/:id', ensureAuthenticated, async (req, res, next) => {

  try {
      const enquiry = await Enquiry.findOne({_id:req.params.id})
      await Object.assign(enquiry, req.body);
      await enquiry.save()
      res.send({status: 200, message: 'Enquiry Updated Successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.put('/update_patnership/:id', ensureAuthenticated, async (req, res, next) => {

  try {
      const partnership = await Patnership.findOne({_id:req.params.id})
      await Object.assign(partnership, req.body);
      await partnership.save()
      res.send({status: 200, message: 'Patnership Updated Successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.put('/update_admin/:id', ensureAuthenticated, async (req, res, next) => {

  try {
      const admin = await User.findOne({_id:req.params.id})
      await Object.assign(admin, req.body);
      await admin.save()
      res.send({status: 200, message: 'Admin was updated successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.get('/public-key', ensureAuthenticated, async (req, res, next) => {
  try {
      const settings = await Settings.findOne({settingsId:"site_settings"})
      const publicStreamKey = shortid.generate()
      await Object.assign(settings, {
        publicStreamKey
      });
      await settings.save()
      res.send({status: 200, message: publicStreamKey});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.get('/member-key', ensureAuthenticated, async (req, res, next) => {
  try {
      const settings = await Settings.findOne({settingsId:"site_settings"})
      const memberStreamKey = shortid.generate()
      await Object.assign(settings, {
        memberStreamKey
      });
      await settings.save()
      res.send({status: 200, message: memberStreamKey});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.put('/salvation-prayer', ensureAuthenticated, multers.upload.single('file'), async (req, res, next) => {
  // submit about
  try {
      if(req.file){
        req.body.salvationPrayerImage = path.basename(req.file.filename, path.extname(req.file.filename))+'.webp'
      
        await sharp(req.file.path)
        .resize({ width: 384, height: 216 })
        .webp({quality: 60})
        .toFile(path.resolve('./public','small_images',req.body.salvationPrayerImage))
  
        await sharp(req.file.path)
        .resize({ width: 640, height: 360 })
        .webp({quality: 90})
        .toFile(path.resolve('./public','large_images',req.body.salvationPrayerImage))
  
        fs.unlinkSync(req.file.path)
      }

      const settings = await Settings.findOne({settingsId:"site_settings"})
      await Object.assign(settings, req.body);
      console.log(settings)
      await settings.save()
      res.send({status: 200, message: 'Salvation Prayer Saved'});
      
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.put('/block/:id', ensureAuthenticated, async (req, res, next) => {
  // block user
  try {
      await User.updateOne(
        { _id: req.params.id },
        { $set:
           {
             isBlocked: true,
           }
        }
     )
      res.status(200).send({status: 200, message: 'User has been blocked successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});
router.put('/member/:id', ensureAuthenticated, async (req, res, next) => {
  // block user
  try {
      await User.updateOne(
        { _id: req.params.id },
        { $set:
           {
            isMember: true,
           }
        }
     )
     await Member.remove({member: req.params.id})
      res.status(200).send({status: 200, message: 'User has been added'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});
router.put('/unblock/:id', ensureAuthenticated, async (req, res, next) => {
  // unblock user
  try {
      await User.updateOne(
        { _id: req.params.id },
        { $set:
           {
             isBlocked: false,
           }
        }
     )
      res.status(200).send({status: 200,message: 'User has been unblocked successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.put('/unmember/:id', ensureAuthenticated, async (req, res, next) => {
  // unblock user
  try {
      await User.updateOne(
        { _id: req.params.id },
        { $set:
           {
            isMember: false,
           }
        }
     )
     await Member.remove({member: req.params.id})
      res.status(200).send({status: 200,message: 'User has been removed'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});



//category handlers
router.get('/categories', ensureAuthenticated, checkLevelThreeAcess, async(req, res, next) => {
  const categories = await Category.find({})
  res.render('admin/pages/categories', { title: 'Categories', categories });
});

router.get('/add_category', ensureAuthenticated, (req, res, next) => {
  res.render('admin/pages/addCat', { title: 'Add category' });
});

router.get('/edit_category/:id', ensureAuthenticated, async(req, res, next) => {
  const category = await Category.findOne({_id: req.params.id})
  console.log(category)
  res.render('admin/pages/edit_cat', { title: 'Edit categories', category });
});

router.post('/add_category', ensureAuthenticated, async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    sendJSONresponse(res, 200, {"message": "Category added successfully"});
  } catch (error) {
    sendJSONresponse(res, 400, {error});
  }
});

router.put('/category/:id', ensureAuthenticated, async (req, res, next) => {
  // update category
  try {
      const category = await Category.findOne({_id:req.params.id})
      await Object.assign(category, req.body);
      await category.save()
      sendJSONresponse(res, 200, {message: 'category updated successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});


router.get('/delete_category/:id', ensureAuthenticated, async (req, res, next) => {
  // delete a category
  try {
      await Category.findOneAndDelete({_id:req.params.id});
      sendJSONresponse(res, 200, {message: "Category deleted"});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.delete('/delete_proposal/:id', ensureAuthenticated,  async (req, res, next) => {
  try {
      await Proposal.findOneAndDelete({_id: req.params.id})
      res.status(200).send({status: 200, message: 'Successfully Deleted proposal'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.delete('/delete_advert/:id', ensureAuthenticated, async (req, res, next) => {
  try {
      await Advert.findOneAndDelete({_id: req.params.id})
      res.status(200).send({status: 200, message: 'Successfully Deleted advert'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.delete('/delete_music_video/:id', ensureAuthenticated, async (req, res, next) => {
  try {
      await MusicVideo.findOneAndDelete({_id: req.params.id})
      res.status(200).send({status: 200, message: 'Successfully Deleted music video'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.delete('/delete_content_developer/:id', ensureAuthenticated, async (req, res, next) => {
  try {
      await Programmer.findOneAndDelete({_id: req.params.id})
      res.status(200).send({status: 200, message: 'Successfully Deleted Content Developer'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.delete('/delete_prayer_request/:id', ensureAuthenticated, async (req, res, next) => {
  try {
      await PrayerRequest.findOneAndDelete({_id: req.params.id})
      res.status(200).send({status: 200, message: 'Successfully Deleted Prayer Request'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});
router.delete('/delete_testimony/:id', ensureAuthenticated, async (req, res, next) => {
  try {
      await Testimony.findOneAndDelete({_id: req.params.id})
      res.status(200).send({status: 200, message: 'Successfully Deleted Testimony'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.delete('/delete_enquiry/:id', ensureAuthenticated, async (req, res, next) => {
  try {
      await Enquiry.findOneAndDelete({_id: req.params.id})
      res.status(200).send({status: 200, message: 'Successfully Deleted Enquiry'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.delete('/delete_patnership/:id', ensureAuthenticated, async (req, res, next) => {
  try {
      await Patnership.findOneAndDelete({_id: req.params.id})
      res.status(200).send({status: 200, message: 'Successfully Deleted Patnership'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.delete('/delete_genre/:id', ensureAuthenticated, async (req, res, next) => {
  try {
      await MusicGenre.findOneAndDelete({_id: req.params.id})
      res.status(200).send({status: 200, message: 'Music Genre was Deleted Successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.delete('/delete_admin_testimony/:id', ensureAuthenticated, async (req, res, next) => {
  try {
      await AdminTestimony.findOneAndDelete({_id: req.params.id})
      res.status(200).send({status: 200, message: 'Successfully Deleted Testimony'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.delete('/delete_admin/:id', ensureAuthenticated, async (req, res, next) => {
  try {
      await User.findOneAndDelete({_id: req.params.id})
      res.status(200).send({status: 200, message: 'Admin was deleted successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.delete('/delete_about/:id', ensureAuthenticated, async (req, res, next) => {
  try {
      await About.findOneAndDelete({_id: req.params.id})
      res.status(200).send({status: 200, message: 'Successfully Deleted About'});
  } catch (error) {
      sendJSONresponse(res, 400, {error: error.message});
  }
});

router.get('/videos', ensureAuthenticated, checkLevelThreeAcess, async(req, res, next) => {
  const videos = await Video.find(
    {
      type: { $ne: '1' }
     }
  ).populate('programme').sort({addedOn:'desc'})
  res.render('admin/pages/videos', { title: 'Videos', videos });
});

router.get('/streaming_videos', ensureAuthenticated, checkLevelThreeAcess, async(req, res, next) => {
  const videos = await Video.find(
    {
      type: '1'
     }
  ).sort({addedOn:'desc'})
  res.render('admin/pages/streaming_videos', { title: 'Streaming videos', videos });
});

router.get('/add_streaming_videos', ensureAuthenticated, async(req, res, next) => {
  res.render('admin/pages/add_streaming_videos', { title: 'Add streaming videos' });
});

// view single video
router.get('/video/:id', ensureAuthenticated, async(req, res, next) => {
  const video = await Video.findOne({_id:req.params.id}).populate('programme').populate('season')
  res.render('admin/pages/video', { title: 'Video', video });
});

//add video form
router.get('/add_video', ensureAuthenticated, async (req, res, next) => {
  const categories = await Category.find({},{ 
    _id:1,
    title:1,
  })
  const programmes = await Programme.find({})
  const seasons = await Season.find({})
  res.render('admin/pages/addVideo', { title: 'Add video', seasons, programmes });
});

// post a video
router.post('/add_streaming_videos', ensureAuthenticated, async (req, res, next) => {
  try {
    if (fs.existsSync(path.join(uploadPath, req.body.video))) {
      //file exists
      req.body.type = '1';
      const video = new Video(req.body);
      await video.save();
      sendJSONresponse(res, 200, {"message": "Streaming video added successfully"});
    }else{
      sendJSONresponse(res, 400, {"message": "File not found"});
    }
  } catch (error) {
    console.log(error)
    sendJSONresponse(res, 400, {error});
  }
});

router.post('/create_music_genre', ensureAuthenticated, async(req, res) =>{
  try{
    if(!req.body){
      return res.status(404).send({ msg: "empty data set" })
    }
      const newGenre = new MusicGenre(req.body);
      const submitted = await newGenre.save();
    if(submitted) return res.status(200).send({status: 200, message:"Genre was created successfully"});

   }catch(error){
    console.log(error);
    res.status(404).send({ msg: error.message });
  }
});

router.post('/create_testimony', ensureAuthenticated, async(req, res) =>{
  try{
    if(!req.body){
      return res.status(404).send({ msg: "empty data set" })
    }
      const testimony = new AdminTestimony(req.body);
      const submittedData = await testimony.save();
    if(submittedData) return res.status(200).send({status: 200, message:"Testimony was created successfully"});

   }catch(error){
    console.log(error);
    res.status(404).send({ msg: error.message });
  }
});

router.post('/create_admin', ensureAuthenticated, async(req, res) =>{
  try{
    if(!req.body){
      return res.status(404).send({ msg: "empty data set" })
    }
      const newAdmin = new User(req.body);
      const adminData = await newAdmin.save();
    if(adminData) return res.status(200).send({status: 200, message:"Admin was created successfully"});

   }catch(error){
    console.log(error);
    res.status(404).send({ msg: error.message });
  }
});

router.post('/add_video', ensureAuthenticated, async (req, res, next) => {
  try {
    let formData = new Map();
    let img_name  = ''
    req.busboy.on('file',  (fieldname, file, filename) => {
        // Create a write stream of the new file
        filename = uuid()+path.extname(filename);
        formData.set(fieldname, filename);
        const fstream = fse.createWriteStream(path.join(uploadPath, filename));
        // Pipe it trough
        file.pipe(fstream);
        // On finish of the upload
      
        fstream.on('close', async() => {

            if(fieldname == 'image'){
              img_name = path.basename(filename, path.extname(filename))+'.webp'

              await sharp(path.join(uploadPath, filename))
              .resize({ width: 384, height: 216 })
              .webp({quality: 90})
              .toFile(
                  path.resolve('./public','small_images',img_name)
              )
          
              await sharp(path.join(uploadPath, filename))
              .resize({ width: 640, height: 360 })
              .webp({quality: 90})
              .toFile(
                  path.resolve('./public','large_images',img_name)
              )
          
              fs.unlinkSync(path.join(uploadPath, filename))
            }
        });
    });

    req.busboy.on('field', (key, value) => {
      formData.set(key, value);
      // ...
    });

    req.busboy.on("finish", async() => {
      const obj = await Object.fromEntries(formData);
      obj.image = img_name
      console.log(obj)
      const vd =  await Video.findOne({title:obj.title})
      if(vd){
        obj.title = obj.title + " "+shortid.generate()
      }
      const video = new Video(obj);
      await video.save();
      res.status(200);
      res.end()
    });
    return req.pipe(req.busboy);

  } catch (error) {
    console.log(error)
    sendJSONresponse(res, 400, {error});
  }
});


//edit video form
router.get('/edit_video/:id', ensureAuthenticated, async (req, res, next) => {
  const video = await Video.findOne({_id:req.params.id})
  const programmes = await Programme.find({})
  const seasons = await Season.find({})
  res.render('admin/pages/edit_video', { title: 'Edit video', video, seasons, programmes });
});

//update videoschema
router.put('/edit_video/:id', ensureAuthenticated, multers.upload.array('file',6),  async (req, res, next) => {
  // update a pre recorded video
  try {
      const video = await Video.findOne({_id:req.params.id})
      //if multiple files are updated
      console.log(req.files)
      if (req.files.length>0){
        if(req.files.length > 1){
          req.body.video = req.files[1].filename
          req.body.image = path.basename(req.files[0].filename, path.extname(req.files[0].filename))+'.webp'

          fs.unlink(path.resolve('./public','small_images', video.image), function(err){
            if (err && err.code == "ENOENT") {
              console.log("small_images file doesnt exist");
            } else if(err) {
               console.log("error");
            }else{
                console.log("file removed");
            }
           });
    
           fs.unlink(path.resolve('./public','large_images', video.image), function(err){
            if (err && err.code == "ENOENT") {
              console.log("large_images file doesnt exist");
            } else if(err) {
               console.log("error");
            }else{
                console.log("file removed");
            }
           });
    
           fs.unlink(path.resolve('./public','uploads', video.video), function(err){
            if (err && err.code == "ENOENT") {
              console.log(" video file doesnt exist");
            } else if(err) {
               console.log("error");
            }else{
                console.log("file removed");
            }
           });
  
          // fs.unlinkSync(path.resolve('./public','small_images', video.image))
          // fs.unlinkSync(path.resolve('./public','large_images', video.image))
          // fs.unlinkSync(path.resolve('./public','uploads', video.video))
  
          await sharp(req.files[0].path)
          .resize({ width: 384, height: 216 })
          .webp({quality: 60})
          .toFile(path.resolve('./public','small_images',req.body.image))
  
          await sharp(req.files[0].path)
          .resize({ width: 640, height: 360 })
          .webp({quality: 90})
          .toFile(path.resolve('./public','large_images',req.body.image))
  
          fs.unlinkSync(req.files[0].path)
        }
        else if(path.extname(req.files[0].path) === '.mp4'){
          req.body.video = req.files[0].filename
          fs.unlink(path.resolve('./public','uploads', video.video), function(err){
            if (err && err.code == "ENOENT") {
              console.log(" video file doesnt exist");
            } else if(err) {
               console.log("error");
            }else{
                console.log("file removed");
            }
           });
          // fs.unlinkSync(path.resolve('./public','uploads', video.video))
        }
        else{
          req.body.image = path.basename(req.files[0].filename, path.extname(req.files[0].filename)+'.webp')
          fs.unlinkSync(path.resolve('./public','small_images', video.image))
          fs.unlinkSync(path.resolve('./public','large_images', video.image))

          await sharp(req.files[0].path)
          .resize({ width: 384, height: 216 })
          .webp({quality: 60})
          .toFile(path.resolve('./public','small_images',req.body.image))
          console.log(req.files[0].filename)

          await sharp(req.files[0].path)
          .resize({ width: 640, height: 360 })
          .webp({quality: 90})
          .toFile(path.resolve('./public','large_images',req.body.image))

          fs.unlinkSync(req.files[0].path)
        }
      }
      
      await Object.assign(video, req.body);
      console.log(video)
      await video.save()
      sendJSONresponse(res, 200, {message: 'Video updated successfully'});
  } catch (error) {
    console.log(error)
      sendJSONresponse(res, 400, {error});
  }
});

//delete from a video schema
router.delete('/pre_recorded/:id', ensureAuthenticated, async (req, res, next) => {
  // delete a video
  try {
      const video = Video.findOne({_id:req.params.id})
      fs.unlink(path.resolve('./public','small_images', video.image), function(err){
        if (err && err.code == "ENOENT") {
          console.log("small_images file doesnt exist");
        } else if(err) {
           console.log("error");
        }else{
            console.log("file removed");
        }
       });

       fs.unlink(path.resolve('./public','large_images', video.image), function(err){
        if (err && err.code == "ENOENT") {
          console.log("large_images file doesnt exist");
        } else if(err) {
           console.log("error");
        }else{
            console.log("file removed");
        }
       });

       fs.unlink(path.resolve('./public','uploads', video.video), function(err){
        if (err && err.code == "ENOENT") {
          console.log(" video file doesnt exist");
        } else if(err) {
           console.log("error");
        }else{
            console.log("file removed");
        }
       });

      await Video.deleteOne(video);
      sendJSONresponse(res, 200, {message: 'Video deleted successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});


router.get('/delete_video/:id', ensureAuthenticated, async (req, res, next) => {
  // delete a video
  try {
      const video =  await Video.findOne({_id:req.params.id});
      fs.unlink(path.resolve('./public','small_images', video.image), function(err){
        if (err && err.code == "ENOENT") {
          console.log("small_images file doesnt exist");
        } else if(err) {
           console.log("error");
        }else{
            console.log("file removed");
        }
       });

       fs.unlink(path.resolve('./public','large_images', video.image), function(err){
        if (err && err.code == "ENOENT") {
          console.log("large_images file doesnt exist");
        } else if(err) {
           console.log("error");
        }else{
            console.log("file removed");
        }
       });

       fs.unlink(path.resolve('./public','uploads', video.video), function(err){
        if (err && err.code == "ENOENT") {
          console.log(" video file doesnt exist");
        } else if(err) {
           console.log("error");
        }else{
            console.log("file removed");
        }
       });


      // fs.unlinkSync(path.resolve('./public','small_images', video.image))
      // fs.unlinkSync(path.resolve('./public','large_images', video.image))
      // fs.unlinkSync(path.resolve('./public','uploads', video.video))
      await Video.deleteOne({_id:video._id});
    sendJSONresponse(res, 200, {message: "Video deleted successfully"})
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.delete('/delete_streaming_video/:id', ensureAuthenticated, async (req, res, next) => {
  // delete a video
  try {
      const video =  await Video.findOne({_id:req.params.id});
      await Video.deleteOne(video);
      sendJSONresponse(res, 200, {message: 'Record deleted successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.get('/live_stream', ensureAuthenticated, async(req, res, next) => {
  const videos = await Video.find(
    { type: '1' }
  )
  .populate('category')
  console.log(videos)
  res.render('admin/pages/liveStream', { title: 'Live Stream', videos });
});

router.get('/pre_recorded', ensureAuthenticated, async(req, res, next) => {
  const videos = await Video.find(
    { type: '2' }
  )
  .populate('category')
  console.log(videos)
  res.render('admin/pages/preRecorded', { title: 'Pre Recorded', videos });
});

router.get('/ready', async(req, res, next) => {
  try{
    const live_stream = await Schedule.findOne(
      { 
        doneStreaming:'0',
        startTime: {$lte: new Date()},
      }
    ).populate("video");
    if(live_stream){
      await Object.assign(live_stream, {doneStreaming:'1'});
      await live_stream.save()
    }
    const settings = await Settings.findOne({settingsId:"site_settings"})
    sendJSONresponse(res, 200, {live_stream,settings});
  }catch{
    sendJSONresponse(res, 400, {error});
  }
});

router.get('/done/:id', async(req, res, next) => {
  try{
    const live_stream = await Video.findOne(
      { 
        _id: req.params.id,
      }
    );
    if(live_stream){
      await Object.assign(live_stream, {doneStreaming:'2'});
      await live_stream.save()
    }
    sendJSONresponse(res, 200, {live_stream});
  }catch{
    sendJSONresponse(res, 400, {error});
  }
 
});

router.get('/add_live_stream', ensureAuthenticated, async (req, res, next) => {
  const categories = await Category.find({},{ 
    _id:1,
    title:1,
  })
  res.render('admin/pages/addLiveStream', { title: 'Add video',categories });
});

router.get('/add_pre_recorded', ensureAuthenticated, async (req, res, next) => {
  const categories = await Category.find({},{ 
    _id:1,
    title:1,
  })
  res.render('admin/pages/addPreRecorded', { title: 'Add Pre Recorded',categories });
});



router.post('/add_live_stream', ensureAuthenticated,  multers.upload.single('file'), async (req, res, next) => {
  try {
    req.body.image = path.basename(req.file.filename, path.extname(req.file.filename))+'.webp'
    req.body.type = 1
    req.body.streamKey = shortid.generate()

    await sharp(req.file.path)
    .resize({ width: 384, height: 216 })
    .webp({quality: 60})
    .toFile(
        path.resolve('./public','small_images',req.body.image)
    )

    await sharp(req.file.path)
    .resize({ width: 640, height: 360 })
    .webp({quality: 90})
    .toFile(
        path.resolve('./public','large_images',req.body.image)
    )

    fs.unlinkSync(req.file.path)

    const video = new Video(req.body);
    await video.save();

    sendJSONresponse(res, 200, {"message": "Video added successfully"});
  } catch (error) {
    sendJSONresponse(res, 400, {error});
  }
});

//pre-recorded-videos routes
router.post('/add_pre_recorded', ensureAuthenticated, multers.upload.array('file',6), async (req, res, next) => {
  try {
    req.body.image = path.basename(req.files[0].filename, path.extname(req.files[0].filename))+'.webp'
    req.body.video = req.files[1].filename
    req.body.type = 2
    req.body.streamKey = shortid.generate()

    await sharp(req.files[0].path)
    .resize({ width: 384, height: 216 })
    .webp({quality: 60})
    .toFile(
        path.resolve('./public','small_images',req.body.image)
    )

    await sharp(req.files[0].path)
    .resize({ width: 640, height: 360 })
    .webp({quality: 90})
    .toFile(
        path.resolve('./public','large_images',req.body.image)
    )

    fs.unlinkSync(req.files[0].path)

    const video = new Video(req.body);
    await video.save();

    sendJSONresponse(res, 200, {"message": "Video added successfully"});
  } catch (error) {
    sendJSONresponse(res, 400, {error});
  }
});


//programme routes 

router.post('/add_programme', ensureAuthenticated, multers.upload.single('file'), async (req, res, next) => {
  try {
    if(!req.file){
      sendJSONresponse(res, 400, {message: "Image required"});
    }
    req.body.image = path.basename(req.file.filename, path.extname(req.file.filename))+'.webp'

    await sharp(req.file.path)
    .resize({ width: 356, height: 200 })
    .webp({quality: 90})
    .toFile(
        path.resolve('./public','small_images',req.body.image)
    )
    await sharp(req.file.path)
    .resize({ width: 712, height: 400 })
    .webp({quality: 90})
    .toFile(
        path.resolve('./public','large_images',req.body.image)
    )
    fs.unlinkSync(req.file.path)
    const programme = new Programme(req.body);
    console.log(programme)
    await programme.save();
    sendJSONresponse(res, 200, {message: "Programme added successfully"});
  } catch (error) {
    sendJSONresponse(res, 400, {error})
    console.log(error);
  }
});

//send single message to user
router.post('/send_message', ensureAuthenticated, async (req, res, next) => {
  // send message to single user
  try {
    const {names, useremail, subject, usermessage} = req.body;

    const messageUser = new SendMessage(req.body);
    const saveMessage = await messageUser.save();
    if(saveMessage){
       customEmail.customEmail(names, useremail, subject, usermessage);
      return res.status(200).send({status: 200, message: 'Message was sent successfully'});
    }else{
        return res.status(400).send({status: 400, msg: 'failed to process'});
    }
  } catch (error) {
    return res.status(400).send({status: 400, msg: 'Message sending failed'});
  }
});

router.get('/programmes', ensureAuthenticated, checkLevelThreeAcess, async (req, res, next) => {
  // get all programmes
    const programmes = await Programme.find({}).populate('categories')
    res.render('admin/pages/programmes', { title: 'Programmes', programmes });
});

router.get('/programme/:id', ensureAuthenticated, async (req, res, next) => {
  // get a single programmme
  try {
      const programme = await Programme.findOne({_id:req.params.id}).populate('categories')
      res.render('admin/pages/programme', { title: 'Programme', programme });
    } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.get('/add_programme', ensureAuthenticated, async (req, res, next) => {
  const categories = await Category.find({})
  res.render('admin/pages/add_programme', { title: 'Add programme', categories });
});

router.get('/edit_programme/:id', ensureAuthenticated, async(req, res, next) => {
  const programme = await (await Programme.findOne({_id: req.params.id})).populate('categories')
  const categories = await Category.find({})
  res.render('admin/pages/edit_programme', { title: 'Edit programme', programme , categories});
});

router.put('/programme/:id', ensureAuthenticated, multers.upload.single('file'), async (req, res, next) => {
  // update a programme
  try {
      const programme = await Programme.findOne({_id:req.params.id})
      if(req.file){
        fs.unlink(path.resolve('./public', 'large_images', programme.image), function(err){
          if (err && err.code == "ENOENT") {
            console.log("file doesnt exist");
          } else if(err) {
             console.log("error");
          }else{
              console.log("file removed");
          }
        });
        fs.unlink(path.resolve('./public', 'large_images', programme.image), function(err){
          if (err && err.code == "ENOENT") {
            console.log("file doesnt exist");
          } else if(err) {
             console.log("error");
          }else{
              console.log("file removed");
          }
        });

        req.body.image = path.basename(req.file.filename, path.extname(req.file.filename))+'.webp'
        await sharp(req.file.path)
        .resize({ width: 356, height: 200 })
        .webp({quality: 90})
        .toFile(path.resolve('./public','small_images',req.body.image))

        await sharp(req.file.path)
        .resize({ width: 712, height: 400 })
        .webp({quality: 90})
        .toFile(path.resolve('./public','large_images',req.body.image))

        fs.unlinkSync(req.file.path)
      }
      await Object.assign(programme, req.body);
      console.log(programme)
      await programme.save()
      sendJSONresponse(res, 200, {message: 'programme updated successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
      console.log(error)
  }
});

router.get('/delete_programme/:id', ensureAuthenticated, async (req, res, next) => {
  // delete a programme
  try {
    const seasons = await Season.find({programme:req.params.id})
    if (seasons.length>0){
      await Season.remove({programme:req.params.id});
    }
      const programme =  await Programme.findOne({_id:req.params.id});
      fs.unlink(path.resolve('./public', 'small_images', programme.image), function(err){
        if (err && err.code == "ENOENT") {
          console.log("file doesn't exist");
        } else if(err) {
           console.log("error");
        }else{
            console.log("file removed");
        }
      });
      fs.unlink(path.resolve('./public', 'large_images', programme.image), function(err){
        if (err && err.code == "ENOENT") {
          console.log("file doesn't exist");
        } else if(err) {
          console.log("error");
        }else{
            console.log("file removed");
        }
      });
      await Programme.deleteOne(programme);
      sendJSONresponse(res, 200, {message : "programme deleted"})
  } catch (error) {
      console.log(error)
      sendJSONresponse(res, 400, {error});
  }
});

// season routes
router.post('/add_season', ensureAuthenticated, async (req, res, next) => {
  try{
    const season = new Season(req.body);
    console.log(season)
    await season.save();
    sendJSONresponse(res, 200, {message: "Season added successfully"});
  } catch (error) {
    sendJSONresponse(res, 400, {error});
    console.log(error)
  }
});


router.get('/seasons', ensureAuthenticated, checkLevelThreeAcess, async (req, res, next) => {
  // get all seasons
  try {
      const seasons = await Season.find({}).populate('programme')
      console.log(seasons)
      res.render('admin/pages/seasons', { title: 'Seasons', seasons});
    } catch (error) {
      sendJSONresponse(res, 400, {error});
      console.log(error)
  }
});

// router.get('/season/:id', async (req, res, next) => {
//   // get a single season
//   try {
//       const season = await Season.findOne({_id: req.params.id}).populate('programme')
//       res.render('admin/pages/season', { title: 'Season'});
//   } catch (error) {
//       sendJSONresponse(res, 400, {error});
//   }
// });

router.get('/add_season', ensureAuthenticated, async (req, res, next) => {
  const programmes = await Programme.find({type:"series"})
  res.render('admin/pages/add_season', { title: 'Add season', programmes });
});

router.get('/edit_season/:id', ensureAuthenticated, async(req, res, next) => {
  const season = await Season.findOne({_id: req.params.id}).populate('programme')
  const programmes = await Programme.find({type:"series"})
  res.render('admin/pages/edit_season', { title: 'Edit programme', season , programmes});
});


router.put('/edit_season/:id', ensureAuthenticated, async (req, res, next) => {
  // update a season
  try {
      const season = await Season.findOne({_id:req.params.id})
      await Object.assign(season, req.body);
      await season.save()
      sendJSONresponse(res, 200, {message: 'season updated successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.get('/delete_season/:id', ensureAuthenticated, async (req, res, next) => {
  // delete a season
  try {
      await Season.findOneAndDelete({_id:req.params.id});
      sendJSONresponse(res, 200, {message: 'season deleted successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});


// populate pragramme seasons on add video form
router.post('/get_seasons', ensureAuthenticated, async(req, res, next) => {
  const season = await Season.find({programme: req.body.programme})
  sendJSONresponse(res, 200, {season});
});

module.exports = router;
