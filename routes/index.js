var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/buy_me_a_coffee', function(req, res, next) {
  res.render('buy_me_a_coffee');
});

router.get('/vk_frame', function(req, res, next) {
  res.render('iframe');
});

router.get('/privacy', function(req, res, next) {
  res.render('privacy');
});

router.get('/terms', function(req, res, next) {
  res.render('terms');
});

module.exports = router;
