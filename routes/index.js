var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('users/pages/index', { title: 'Home' });
});

router.get('/categories', function(req, res, next) {
  res.render('users/pages/cats', { title: 'Categories' });
});

router.get('/video-details', function(req, res, next) {
  res.render('users/pages/video_details', { title: 'Video details' });
});



module.exports = router;
