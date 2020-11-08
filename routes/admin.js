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
const router = express.Router();

const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};


const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
       res.redirect('/admin/dashboard');
  }else {
     next();
  }
};

const ensureAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/admin");
  } else {
    next();
  }
};

// User.find({}, (err, users) => {
//   if(err){ return;}
//   if(users.length == 0){
//       var newUser = new User({
//         firstname: "Church",
//         lastname: "stream",
//         title:'Mr',
//         email: "bossworker@gmail.com",
//         password: "11223344E"
//       });
//       newUser.save((err, user) => {
//         if (err) { 
//           console.log(err);
//           return; 
//         }else{
//             console.log(user);
//         }
//       });
//   }
// })

Settings.find({}, (err, settings) => {
  if(err){ return;}
  if(settings.length == 0){
      var newSettings = new Settings({
        settingsId: "site_settings",
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
  res.redirect('/admin');
});

router.get('/dashboard', ensureAuthenticated, async(req, res, next) => {
  res.render('admin/pages/index', { title: 'Dashboard' });
});

router.get('/site-details', ensureAuthenticated, async(req, res, next) => {
  const settings = await Settings.findOne({settingsId:"site_settings"})
  res.render('admin/pages/site_details', { title: 'Site Details', settings });
});

router.get('/add_about', ensureAuthenticated, async(req, res, next) => {
  res.render('admin/pages/add_about', { title: 'Add About' });
});
router.get('/edit_about', ensureAuthenticated, async(req, res, next) => {
  const about = await About.findOne({_id:req.query.id})
  res.render('admin/pages/edit_about', { title: 'Edit About', about });
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



router.get('/categories', ensureAuthenticated, async(req, res, next) => {
  const categories = await Category.find({})
  res.render('admin/pages/index', { title: 'Dashboard', categories });
});


router.get('/videos', ensureAuthenticated, async(req, res, next) => {
  const videos = await Video.find(
    { $or: [ { type: '0' }, { doneStreaming: '2' } ] }
  )
  .populate('category')
  console.log(videos)
  res.render('admin/pages/videos', { title: 'Videos', videos });
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




router.get('/add_category', ensureAuthenticated, (req, res, next) => {
  res.render('admin/pages/addCat', { title: 'Add category' });
});

router.get('/add_video', ensureAuthenticated, async (req, res, next) => {
  const categories = await Category.find({},{ 
    _id:1,
    title:1,
  })
  res.render('admin/pages/addVideo', { title: 'Add video',categories });
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

//category handlers
router.post('/add_category', ensureAuthenticated, async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    sendJSONresponse(res, 200, {"message": "Category added successfully"});
  } catch (error) {
    sendJSONresponse(res, 400, {error});
  }
});

router.put('/category/:id', async (req, res, next) => {
  // update category
  try {
      const category = await Category.findOne({_id:req.params.id})
      await Object.assign(category, req.body);
      await category.save()
      sendJSONresponse(res, 200, {message: 'category details updated successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.delete('/category/:id', async (req, res, next) => {
  // delete a category
  try {
      await Category.findOneAndDelete({_id:req.params.id});
      sendJSONresponse(res, 200, {message: 'Category deleted successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});


router.post('/add_video', ensureAuthenticated,  multers.upload.array('file',6), async (req, res, next) => {
  try {
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
    sendJSONresponse(res, 400, {error});
  }
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

//update videoschema
router.put('/video/:id', multers.upload.array('file',6),  async (req, res, next) => {
  // update a pre recorded video
  try {
      const video = await Video.findOne({_id:req.params.id})

      //if multiple files are updated
      if(req.files.length > 0){
        fs.unlinkSync(path.resolve('./public','small_images', video.image))
        fs.unlinkSync(path.resolve('./public','large_images', video.image))
        fs.unlinkSync(path.resolve('./public','uploads', video.video))

        req.body.video = req.files[1].filename
        req.body.image = path.basename(req.file.filename, path.extname(req.files[0].filename))+'.webp'

        await sharp(req.files[0].path)
        .resize({ width: 384, height: 216 })
        .webp({quality: 60})
        .toFile(path.resolve('./public','small_images',req.body.image))

        await sharp(req.file[0].path)
        .resize({ width: 640, height: 360 })
        .webp({quality: 90})
        .toFile(path.resolve('./public','large_images',req.body.image))

        fs.unlinkSync(req.files[0].path)
      }

      // if the video file is updated
      else if(path.extname(req.files[0].filename) = 'mp4'){
          fs.unlinkSync(path.resolve('./public','uploads', video.video))
          req.body.video = req.files[0].filename
        }

        //if the image file is updated
      else{
          fs.unlinkSync(path.resolve('./public','small_images', video.image))
          fs.unlinkSync(path.resolve('./public','large_images', video.image))

          req.body.image = path.basename(req.file.filename, path.extname(req.files[0].filename))+'.webp'

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

      await Object.assign(video, req.body);
      await video.save()
      sendJSONresponse(res, 200, {message: 'Video updated successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

//delete from a video schema
router.delete('/pre_recorded/:id', async (req, res, next) => {
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

//programme routes 

router.post('/add_programme', multers.upload.single('file'), async (req, res, next) => {
  try {
    if(!req.file){
      sendJSONresponse(res, 400, {message: "Image required"});
    }
    req.body.image = path.basename(req.file.filename, path.extname(req.file.filename))+'.webp'
    await sharp(req.file.path)
    .resize({ width: 640, height: 360 })
    .webp({quality: 90})
    .toFile(
        path.resolve('./public','large_images',req.body.image)
    )
    fs.unlinkSync(req.file.path)
    const programme = new Programme(req.body);
    await programme.save();
    sendJSONresponse(res, 200, {"message": "Programme added successfully"});
  } catch (error) {
    sendJSONresponse(res, 400, {error});
  }
});

router.get('/programmes', async (req, res, next) => {
  // get all programmes
  try {
      const programmes = await Programme.find({})
      sendJSONresponse(res, 200, {programmes});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.get('/programme/:id', async (req, res, next) => {
  // get a single programmme
  try {
      const programme = await Programme.findOne({code:req.params.id})
      sendJSONresponse(res, 200, {programme});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.put('/programme/:id', multers.upload.single('file'), async (req, res, next) => {
  // update a programme
  try {
      const programme = await Programme.findOne({_id:req.params.id})
      if(req.file){
        fs.unlinkSync(path.resolve('./public','small_images', programme.image))
        fs.unlinkSync(path.resolve('./public','large_images', programme.image))

        req.body.image = path.basename(req.file.filename, path.extname(req.file.filename))+'.webp'
        await sharp(req.file.path)
        .resize({ width: 384, height: 216 })
        .webp({quality: 60})
        .toFile(path.resolve('./public','small_images',req.body.image))

        await sharp(req.file.path)
        .resize({ width: 640, height: 360 })
        .webp({quality: 90})
        .toFile(path.resolve('./public','large_images',req.body.image))

        fs.unlinkSync(req.file.path)
      }
      await Object.assign(programme, req.body);
      await programme.save()
      sendJSONresponse(res, 200, {message: 'programme updated successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.delete('/programme/:id', async (req, res, next) => {
  // delete a programme
  try {
      const programme =  await Programme.findOne({_id:req.params.id});
      fs.unlinkSync(path.resolve('./public','small_images', programme.image))
      fs.unlinkSync(path.resolve('./public','large_images', programme.image))
      await Programme.deleteOne(programme);
      sendJSONresponse(res, 200, {message: 'Programme deleted successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

// season routes
router.post('/season', async (req, res, next) => {
  try{
    const season = new Season(req.body);
    await season.save();
    sendJSONresponse(res, 200, {message: "Season added successfully"});
  } catch (error) {
    sendJSONresponse(res, 400, {error});
  }
});

router.get('/season', async (req, res, next) => {
  // get all seasons
  try {
      const season = await Season.find({})
      sendJSONresponse(res, 200, {season});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.get('/season/:id', async (req, res, next) => {
  // get a single season
  try {
      const season = await Season.findOne({_id: req.params.id})
      sendJSONresponse(res, 200, {season});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.put('/season/:id', async (req, res, next) => {
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

router.delete('/season/:id', async (req, res, next) => {
  // delete a season
  try {
      await Season.findOneAndDelete({_id:req.params.id});
      sendJSONresponse(res, 200, {message: 'season deleted successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

module.exports = router;
