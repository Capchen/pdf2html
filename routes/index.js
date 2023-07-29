var express = require('express');
var router = express.Router();

const fileController = require('../controllers/fileController')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/success', function(req, res, next) {
  res.render('success', {
    fileName: req.query.fileName
  });
});

// upload api
router.post('/uploadPdf', fileController.upload);

router.get('/downloadPdf', fileController.download);

module.exports = router;
