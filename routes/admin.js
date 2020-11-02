const express = require('express');
const User = require('../models/user');
const Category = require('../models/category');
const Video = require('../models/video');
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

User.find({}, (err, users) => {
  if(err){ return;}
  if(users.length == 0){
      var newUser = new User({
        firstname: "Church",
        lastname: "stream",
        email: "bossworker@gmail.com",
        password: "11223344E"
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

router.post('/add_category', ensureAuthenticated,  multers.upload.single('file'), async (req, res, next) => {
  try {
    if(!req.file){
      sendJSONresponse(res, 400, {"message": "Image required"});
    }
    req.body.image = path.basename(req.file.filename, path.extname(req.file.filename))+'.webp'
    await sharp(req.file.path)
    .resize({ width: 640, height: 360 })
    .webp({quality: 90})
    .toFile(
        path.resolve('./public','large_images',req.body.image)
    )
    fs.unlinkSync(req.file.path)
    const category = new Category(req.body);
    await category.save();
    sendJSONresponse(res, 200, {"message": "Category added successfully"});
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

router.post('/add_pre_recorded', ensureAuthenticated,  multers.upload.array('file',6), async (req, res, next) => {
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

//add programme
router.post('/add_programme', multers.upload.single('file'), async (req, res, next) => {
  try {
    if(!req.file){
      sendJSONresponse(res, 400, {"message": "Image required"});
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
router.get('/prrogramme/:id', async (req, res, next) => {
  // get a single programmme
  try {
      const programme = await Programme.findOne({_id:req.params.id})
      sendJSONresponse(res, 200, {programme});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.put('/programme/:id', async (req, res, next) => {
  // update a programme
  try {
      const programme = await Programme.findOne({_id:req.params.id})
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
      await Programme.findOneAndDelete({_id:req.params.id});
      sendJSONresponse(res, 200, {message: 'Programme deleted successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});


// add season
router.post('/season', async (req, res, next) => {
  try{
    const season = new Season(req.body);
    await season.save();
    sendJSONresponse(res, 200, {"message": "Season added successfully"});
  } catch (error) {
    sendJSONresponse(res, 400, {error});
  }
});

router.get('/season/:id', async (req, res, next) => {
  // get a single proposal
  try {
      const season = await Season.findOne({_id:req.params.id})
      sendJSONresponse(res, 200, {proposal});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.put('/proposal/:id', async (req, res, next) => {
  // update a show proposal
  try {
      const proposal = await Proposal.findOne({_id:req.params.id})
      await Object.assign(proposal, req.body);
      await proposal.save()
      sendJSONresponse(res, 200, {message: 'proposal details updated successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

router.delete('/proposal/:id', async (req, res, next) => {
  // delete a show proposal
  try {
      await Proposal.findOneAndDelete({_id:req.params.id});
      sendJSONresponse(res, 200, {message: 'Proposal deleted successfully'});
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});

module.exports = router;
