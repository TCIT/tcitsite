var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('../public/index-one-page.html', { title: 'TCIT | Web solutions' });
});

module.exports = router;
