const express = require('express');
const User = require('../models/user');
const Category = require('../models/category');
const Video = require('../models/video');
const Settings = require('../models/settings');
const About = require('../models/about');
const Programme = require('../models/programme');
const Season = require('../models/season');
const passport = require('passport');
const multers = require('../middleware/multers')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const moment = require('moment');
const shortid = require('shortid');
const { Session } = require('inspector');
const router = express.Router();

const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};


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
  res.render('admin/pages/index', { title: 'Dashboard' });
});

//settings
router.put('/settings', ensureAuthenticated, async (req, res, next) => {
  // site settings
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

// settings/site details
router.get('/site-details', ensureAuthenticated, async(req, res, next) => {
  const settings = await Settings.findOne({settingsId:"site_settings"})
  res.render('admin/pages/site_details', { title: 'Site Details', settings });
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

router.put('/block/:id', async (req, res, next) => {
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
router.put('/unblock/:id', async (req, res, next) => {
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

//view all videos
router.get('/videos', ensureAuthenticated, async(req, res, next) => {
  const videos = await Video.find(
    { }
  ).populate('programme')
  res.render('admin/pages/videos', { title: 'Videos', videos });
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

//post a video
router.post('/add_video', ensureAuthenticated, multers.upload.array('file',6), async (req, res, next) => {
  try {
    if(req.files.length<1){
      sendJSONresponse(res, 400, {message: "File required"});
    }
    req.body.image = path.basename(req.files[0].filename, path.extname(req.files[0].filename))+'.webp'
    req.body.video = req.files[1].filename

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
    const live_stream = await Video.findOne(
      { 
        type: '2',
        doneStreaming:'0',
        scheduledOn: {$lte: new Date()},
      }
    );
    if(live_stream){
      await Object.assign(live_stream, {doneStreaming:'1'});
      await live_stream.save()
    }
    sendJSONresponse(res, 200, {live_stream});
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
