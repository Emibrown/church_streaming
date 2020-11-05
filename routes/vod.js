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



router.use((req, res, next) => {
  res.locals.moment = moment;
  res.locals.currentUser = req.user;
  next();
});

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('vod/pages/index', { title: 'On-demand Categories' });
});

router.get('/watch', (req, res, next) => {
  res.render('vod/pages/watch', { title: 'On-demand Watch' });
});

router.get('/cat', (req, res, next) => {
  res.render('vod/pages/cat', { title: 'On-demand Category' });
});

module.exports = router;
