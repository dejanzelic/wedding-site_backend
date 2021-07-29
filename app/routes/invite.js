var express = require('express');
var router = express.Router();

const model = require(__dirname + '/../models');


/* GET users listing. */
router.get('/:inviteCode', function(req, res, next) {
  // model.Invite.findAll()
  res.send('respond with a resource');
});

module.exports = router;
