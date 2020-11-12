const express = require('express');
const User = require('../models/user');
const Category = require('../models/category');
const Programme = require('../models/programme');
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
  res.redirect("/vod/watch/"+req.params.pro+"/"+videos[0].code);
});

router.get('/watch/:pro/:video', async(req, res, next) => {
  const video = await Video.findOne({code:req.params.video}).populate('season')
  const programme = await Programme.findOne({code:req.params.pro})
  const season = await Season.find({programme:programme._id})
  let list = []
  if(programme.type == 'series' ){
    list = await Video.find({season:video.season})
  }else{ 
    list = await Video.find({programme:programme._id})
  }
  console.log(list)
  res.render('vod/pages/watch', { title: 'On-demand Watch',video,programme,season,list });
});

router.get('/cat/:code', async(req, res, next) => {
  const cat = await Category.findOne({code:req.params.code})
  const programmes = await Programme.find({
    categories:cat._id
  })
  res.render('vod/pages/cat', { title: 'On-demand Category',programmes });
});

module.exports = router;
