const express = require('express');
const User = require('../models/user');
const Category = require('../models/category');
const Programme = require('../models/programme');

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

router.get('/watch', (req, res, next) => {
  res.render('vod/pages/watch', { title: 'On-demand Watch' });
});

router.get('/cat/:code', async(req, res, next) => {
  const cat = await Category.findOne({code:req.params.code})
  const programmes = await Programme.find({
    categories:cat._id
  })
  res.render('vod/pages/cat', { title: 'On-demand Category',programmes });
});

module.exports = router;
