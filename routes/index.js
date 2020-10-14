const express = require('express');
const Category = require('../models/category');
const Video = require('../models/video');

const moment = require('moment');

const router = express.Router();


router.use((req, res, next) => {
  res.locals.moment = moment;
  next();
});

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
  res.render('users/pages/cats', { title: 'Categories' });
});

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



module.exports = router;
