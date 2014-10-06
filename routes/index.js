var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index-one-page.html');
});

/* GET site map. */
router.get('/sitemap', function(req, res) {
  res.render('sitemap.xml');
});

module.exports = router;
