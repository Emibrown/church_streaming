var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin/pages/login', { title: 'Login' });
});


router.get('/dashboard', function(req, res, next) {
  res.render('admin/pages/index', { title: 'Dashboard' });
});


module.exports = router;
