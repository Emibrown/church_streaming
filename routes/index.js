const express = require('express');
const Category = require('../models/category');
const Video = require('../models/video');
const Advert = require('../models/advert');
const PrayerRequest = require('../models/prayerRequest');
const Programmer = require('../models/programmer');
const Proposal = require('../models/showProposal');
const SalvationPrayer = require('../models/salvationPrayer');
const Testimony = require('../models/testimony');
const MusicVideo = require('../models/musicVideo');
const Partnership = require('../models/patnership');
const moment = require('moment');
const router = express.Router();

router.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});

const sendJSONresponse = (res, status, content) => {
  res.status(status);
  res.json(content);
};

/* GET home page. */
router.get('/', async (req, res, next) => {
  const categories = await Category.find({})
  // const test = await Video.find(
  //   { 
  //     type: {$gt: '0'},
  //     doneStreaming:  {$lt: '2'},
  //   }
  // )
  // .sort({scheduledOn:1}) 

  const streams = await Video.aggregate([
    { 
      $match: 
      { 
        type: { $gt: '0' } ,
        doneStreaming:  {$lte: '2'},
        scheduledOn: {$gte: new Date(new Date().setHours(00, 00, 00))}
      } 
    },
    {
        $project : {
            title : 1,
            description : 1,
            image: 1,
            type: 1,
            doneStreaming: 1,
            streamKey: 1,
            scheduledOn: 1,
            difference : {
                $abs : {
                    $subtract : [new Date(new Date().setHours(00, 00, 00)), "$scheduledOn"]
                }
            }
        }
    },
    {
        $sort : {difference : 1}
    },
    {
        $limit : 3
    }
    ])
  console.log(streams)
  res.render('users/pages/index', { title: 'Home',categories,streams });
});

router.get('/categories', (req, res, next) => {
  res.render('users/pages/cats', { title: 'Faith TV | Categories' });
});

router.get('/about', (req, res, next) =>{
  res.render('users/pages/about', { title: 'Faith TV | About' });
});

router.get('/dayview', (req, res, next) =>{
  res.render('users/pages/dayview', { title: 'Day View' });
});

router.get('/schedule', (req, res, next) =>{
  res.render('users/pages/schedule', { title: 'Faith TV | Schedule' });
});

router.get('/highlights', (req, res, next) =>{
  res.render('users/pages/high', { title: 'Faith TV | Highlights' });
});

router.get('/show-proposal', (req, res, next) =>{
  res.render('users/pages/show_proposal', { title: 'Faith TV | Submit Show Proposal' });
});

router.get('/music-video', (req, res, next) =>{
  res.render('users/pages/music_video', { title: 'Faith TV | Submit Music Video' });
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
router.get('/contact', (req, res, next) =>{
  res.render('users/pages/contact', { title: 'Faith TV | Contact' });
});
router.get('/enquiries', (req, res, next) =>{
  res.render('users/pages/enquiries', { title: 'Faith TV | Enquiries' });
});
router.get('/partnership', (req, res, next) =>{
  res.render('users/pages/partnership', { title: 'Faith TV | Partnership' });
});
router.get('/register', (req, res, next) =>{
  res.render('users/pages/register', { title: 'Faith TV | Register' });
});
router.get('/login', (req, res, next) =>{
  res.render('users/pages/login', { title: 'Faith TV | Login' });
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

//advert routes
router.post('/advert', async (req, res, next) => {
    // submit an advert
    try {
        const advert = new Advert(req.body)
        await advert.save()
        sendJSONresponse(res, 200, {message: 'advert submitted'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//prayerRequest routes
router.post('/prayer_request', async (req, res, next) => {
    // submit a prayer request
    try {
        const prayerRequest = new PrayerRequest(req.body)
        await prayerRequest.save()
        sendJSONresponse(res, 200, {message: 'prayer request submitted'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//programmer routes
router.post('/become_programmer', async (req, res, next) => {
    //  submit a programmer request
    try {
        const programmer = new Programmer(req.body)
        await programmer.save()
        sendJSONresponse(res, 200, {message: 'form submitted'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//show proposal routes
router.post('/show_proposal', async (req, res, next) => {
    // create a proposal
    try {
        const proposal = new Proposal(req.body)
        await proposal.save()
        sendJSONresponse(res, 200, {message: 'Proposal submitted'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//salvation prayers routes
router.post('/salvation_prayer', async (req, res, next) => {
    // create a salvation prayer
    try {
        const salvationPrayer = new SalvationPrayer(req.body)
        await salvationPrayer.save()
        sendJSONresponse(res, 200, {message: 'salvation prayer created'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//testimonies routes
router.post('/testimony', async (req, res, next) => {
    // create a testimony
    try {
        const testimony = new Testimony(req.body)
        await testimony.save()
        sendJSONresponse(res, 200, {message: 'testimony submitted'});
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//music video routes
router.post('/music_video', async (req, res, next) => {
    // submit music video
    try {
        const musicVideo = new MusicVideo(req.body);
        console.log(musicVideo)
        await musicVideo.save();
        sendJSONresponse(res, 200, {message: "Music video added successfully"});   
    } catch (error) {
        sendJSONresponse(res, 400, {error});
    }
});

//patnership routes
router.post('/patnership', async (req, res, next) => {
  // submit a patnership form
  try {
      const patnership = new Partnership(req.body);
      console.log(patnership)
      await patnership.save();
      sendJSONresponse(res, 200, {message: "patnership form submitted"});   
  } catch (error) {
      sendJSONresponse(res, 400, {error});
  }
});
module.exports = router;
