const express = require('express');
const User = require('../models/user');
const Category = require('../models/category');
const Programme = require('../models/programme');
const Settings = require('../models/settings');
const History = require('../models/history');
const Watch = require('../models/watch');
const Favourite = require('../models/favourite');



const Season = require('../models/season');


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

const getProgrammes = async (id) =>{
  const programme = await Programme.find({
    categories: id
  })
  return programme
}





router.use(async(req, res, next) => {
  res.locals.moment = moment;
  res.locals.currentUser = req.user;
  res.locals.settings = await Settings.findOne({settingsId:"site_settings"})
  next();
});



/* GET home page. */
router.get('/', async(req, res, next) => {
  Category.aggregate([{
      $lookup: {
          from: "programmes", // collection name in db
          localField: "_id",
          foreignField: "categories",
          as: "programme"
      }
  }]).exec(function(err, categories) {
      res.render('vod/pages/index', { title: 'On-demand Categories', categories });
  });
});

router.get('/watch/:pro', async (req, res, next) => {
  const programme = await Programme.findOne({code:req.params.pro})
  const videos = await Video.find({programme:programme._id}).sort({ addedOn : 1 })
  if(videos.length == 0){
    res.redirect("/vod");
  }
  res.redirect("/vod/watch/"+req.params.pro+"/"+videos[0].code);
});

router.get('/video/:video', async (req, res, next) => {
  const video = await Video.findOne({code:req.params.video}).populate('programme')
  if(!video){
    res.redirect("/vod");
  }
  res.redirect("/vod/watch/"+video.programme.code+"/"+req.params.video);
});

router.get('/watch/:pro/:video', async(req, res, next) => {
  const video = await Video.findOne({code:req.params.video}).populate('season')
  if(video){
    const history = await History.findOne({video:video._id, member: req.user._id })
    if(!history){
      const newHistroy = new History({
        video:video._id,
        member: req.user._id,
      })
      await newHistroy.save()
    }
  }
  const programme = await Programme.findOne({code:req.params.pro})
  let season = []
  let list = []
  if(programme.type == 'series' ){
    season = await Season.find({programme:programme._id})
    list = await Video.find({season:video.season})
  }else{ 
    list = await Video.find({programme:programme._id})
  }
  res.render('vod/pages/watch', { title: 'On-demand Watch',video,programme,season,list });
});

router.get('/webcast', ensureAuthenticated, async(req, res, next) => {
  res.render('vod/pages/webcast', { title: 'On-demand Watch' });
});

router.get('/watch-later', ensureAuthenticated, async(req, res, next) => {
  const videos = await Watch.find({member: req.user._id}).populate('video')
  res.render('vod/pages/videos', { title:"Watch later", videos });
});

router.get('/favourites', ensureAuthenticated, async(req, res, next) => {
  const videos = await Favourite.find({member: req.user._id}).populate('video')
  res.render('vod/pages/videos', { title:"Favourites", videos });
});

router.get('/history', ensureAuthenticated, async(req, res, next) => {
  const videos = await History.find({member: req.user._id}).populate('video')
  res.render('vod/pages/videos', { title:"History", videos });
});

router.get('/cat/:code', async(req, res, next) => {
  const cat = await Category.findOne({code:req.params.code})
  const programmes = await Programme.find({
    categories:cat._id
  })
  res.render('vod/pages/cat', { title: cat.title,programmes });
});

module.exports = router;
