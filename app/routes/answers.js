var express = require('express');
var router = express.Router();
const model = require(__dirname + '/../models');


require(__dirname + '/../middleware/findInvite.js')(router);

/* GET home page. */
router.post('/:inviteCode', function (req, res, next) {
  let answers = req.body;

  if (!Array.isArray(answers)) {
    err = new Error()
    err.code = 500;
    err.type = "INCORRECT_PARAM"
    err.customMessage = "Incorrect property type. Expected an Array"
    return next(err)
  }
  if (answers.length > 0) {
    console.log()
    model.Answers.bulkCreate(answers.map(a => (
      {
        inviteId: req.invite.id,
        answer: a.answer,
        name: a.name
      }
    )))
      .then(() => {
        res.send({
          code: 200,
          type: "SUCCESS",
          message: "Answers were saved"
        });
      }).catch((err) => {
        err.code = 500;
        err.type = "SAVE_ERROR"
        err.customMessage = "Something went wrong during saving"
        next(err)
      })
  } else {
    res.send({
      code: 200,
      type: "SUCCESS",
      message: "No answers were provided"
    });
  }


});

module.exports = router;
