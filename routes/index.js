const express = require('express');
const Category = require('../models/category');
const Video = require('../models/video');
const router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
  const categories = await Category.find({})
  const streams = await Video.find(
    { 
      type: {$gt: '0'},
      doneStreaming:  {$lt: '2'},
    }
  )
  .sort({scheduledOn:-1}) 
  console.log(categories)
  console.log(streams)
  res.render('users/pages/index', { title: 'Home',categories,streams });
});

router.get('/categories', (req, res, next) => {
  res.render('users/pages/cats', { title: 'Categories' });
});

router.get('/video-details', (req, res, next) => {
  res.render('users/pages/video_details', { title: 'Video details' });
});



module.exports = router;
