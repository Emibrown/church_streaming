const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('users/pages/index', { title: 'Home' });
});

router.get('/categories', (req, res, next) => {
  res.render('users/pages/cats', { title: 'Categories' });
});

router.get('/video-details', (req, res, next) => {
  res.render('users/pages/video_details', { title: 'Video details' });
});



module.exports = router;
