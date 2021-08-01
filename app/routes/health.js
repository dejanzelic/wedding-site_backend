var express = require('express');
const model = require(__dirname + '/../models');

var router = express.Router();

router.get('/', function (req, res, next) {
  model.Invite.findOne()
  .then(data => {
    if (data){
      res.send({
        code: 200,
        type: "HEALTHY",
        message: "Server is working and connected to the database"
      });
    }else{
      res.send({
        code: 200,
        type: "HEALTHY",
        message: "Server is working and connected to the database. However, Database is empty"
      });
    }

  })
  .catch( err => {
    err.status = 500;
    next(err)
  })

});

module.exports = router;
