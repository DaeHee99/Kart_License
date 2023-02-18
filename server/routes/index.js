const express = require('express');
const router = express.Router();
const path = require('path');

router.use(express.static(path.join(__dirname, "../../client/build")));


router.get('/.well-known/pki-validation/B19EF3B9AEDC57E6DE88D7A48BA01F5D.txt', function(req, res) {
  res.sendFile(path.join(__dirname + '../config/B19EF3B9AEDC57E6DE88D7A48BA01F5D.txt'));
})

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

module.exports = router;
