const express = require('express');
const Advert = require('../models/advert');
const User = require('../models/user');
const Category = require('../models/category');
const Video = require('../models/video');
const Settings = require('../models/settings');
const About = require('../models/about');
const Programme = require('../models/programme');
const Schedule = require('../models/schedule');
const Season = require('../models/season');
const SendMessage = require('../models/sendMessage');
const MusicGenre = require('../models/musicGenres');
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

/* GET home page. */
router.get('/',authenticated, (req, res, next) => {
  res.render('admin/pages/login', { title: 'Login' });
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
  res.render('admin/pages/index', { title: 'Dashboard', members, programmes, videos });
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
      console.log('streaming stoped');
    } catch (error) {
        console.error(error);
        // return error.code === 'EPERM';
    }
    sendJSONresponse(res, 200, {message: 'Streaming ended on all platforms'});
});




// settings/site details
router.get('/site-details', ensureAuthenticated, async(req, res, next) => {
  const settings = await Settings.findOne({settingsId:"site_settings"})
  res.render('admin/pages/site_details', { title: 'Admin | Site Details', settings });
});

router.get('/send-message/:id', ensureAuthenticated, async(req, res, next) => {
  const getUser = await User.findOne({_id:req.params.id})
  res.render('admin/pages/send_message', { title: 'Admin | Send Message', getUser });
});

router.get('/salvation-prayer', ensureAuthenticated, async(req, res, next) => {
  const settings = await Settings.findOne({settingsId:"site_settings"})
  res.render('admin/pages/salvation_prayer', { title: 'Salvation Prayer', settings });
});

router.get('/add_about', ensureAuthenticated, async(req, res, next) => {
  res.render('admin/pages/add_about', { title: 'Add About' }); 
});

router.get('/streaming', ensureAuthenticated, async(req, res, next) => {
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
router.get('/social-media', ensureAuthenticated, async(req, res, next) => {
  const settings = await Settings.findOne({settingsId:"site_settings"})
  res.render('admin/pages/social_media', { title: 'Social Media', settings });
});

// manage users/view users
router.get('/view-users', ensureAuthenticated, async(req, res, next) => {
  const users = await User.find({type:0})
  res.render('admin/pages/view_users', { title: 'View Users', users });
});

router.get('/view-single/:id', ensureAuthenticated, async(req, res, next) => {
  const user = await User.findById({_id: req.params.id})
  res.render('admin/pages/view_single_user', { title: 'View Single User', user });
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



//category handlers
router.get('/categories', ensureAuthenticated, async(req, res, next) => {
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
      res.redirect('/admin/categories');
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
router.get('/videos', ensureAuthenticated, async(req, res, next) => {
  const videos = await Video.find(
    {
      type: { $ne: '1' }
     }
  ).populate('programme')
  res.render('admin/pages/videos', { title: 'Videos', videos });
});

router.get('/streaming_videos', ensureAuthenticated, async(req, res, next) => {
  const videos = await Video.find(
    {
      type: '1'
     }
  )
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
  
          fs.unlinkSync(path.resolve('./public','small_images', video.image))
          fs.unlinkSync(path.resolve('./public','large_images', video.image))
          fs.unlinkSync(path.resolve('./public','uploads', video.video))
  
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
          fs.unlinkSync(path.resolve('./public','uploads', video.video))
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
      fs.unlinkSync(path.resolve('./public','small_images', video.image))
      fs.unlinkSync(path.resolve('./public','large_images', video.image))
      fs.unlinkSync(path.resolve('./public','uploads', video.video))
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
      fs.unlinkSync(path.resolve('./public','small_images', video.image))
      fs.unlinkSync(path.resolve('./public','large_images', video.image))
      fs.unlinkSync(path.resolve('./public','uploads', video.video))
      await Video.deleteOne(video);
      res.redirect('/admin/videos');
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.get('/delete_streaming_video/:id', ensureAuthenticated, async (req, res, next) => {
  // delete a video
  try {
      const video =  await Video.findOne({_id:req.params.id});
      await Video.deleteOne(video);
      res.redirect('/admin/streaming_videos');
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

router.get('/programmes', ensureAuthenticated, async (req, res, next) => {
  // get all programmes
    const programmes = await Programme.find({}).populate('categories')
    res.render('admin/pages/programmes', { title: 'Programmes', programmes });
    console.log(programmes)
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
        fs.unlinkSync(path.resolve('./public','small_images', programme.image))
        fs.unlinkSync(path.resolve('./public','large_images', programme.image))

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
      fs.unlinkSync(path.resolve('./public','small_images', programme.image))
      fs.unlinkSync(path.resolve('./public','large_images', programme.image))
      await Programme.deleteOne(programme);
      
      res.redirect('/admin/programmes');
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


router.get('/seasons', ensureAuthenticated, async (req, res, next) => {
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
      res.redirect('/admin/seasons');
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
