var express = require('express');
var router = express.Router();

require(__dirname + '/../middleware/findInvite.js')(router);


/* GET users listing. */
router.get('/:inviteCode', function (req, res, next) {

  let resObj = {
    email: req.invite.email,
    language: req.invite.language,
    confirmed: req.invite.confirmed,
    list: req.guests.map(guest => ({ name: guest.name, attending: guest.attending }))
  }
  res.send(resObj);
});

router.put('/:inviteCode', function (req, res, next) {
  // TODO log all errors
  invite = req.invite
  guests = req.guests
  err = [];
  if (!req.body.email) {
    err.push({
      code: 500,
      type: "MISSING_PARAM",
      message: "The 'email' paramater is missing"
    })
  }
  if (!req.body.list) {
    err.push({
      code: 500,
      type: "MISSING_PARAM",
      message: "The 'list' paramater is missing"
    })
  } else if (!Array.isArray(req.body.list)) {
    err.push({
      code: 500,
      type: "INCORRECT_PARAM",
      message: "Incorrect property type. List is expected to be an Array"
    });
  } else if (req.body.list.length !== guests.length) {
    err.push({
      code: 500,
      type: "INCORRECT_LENGTH",
      message: "Guest length not as expected"
    });
  } else {
    req.body.list.forEach(g => {
      if (typeof g.attending !== "boolean") {
        err.push({
          code: 500,
          type: "INCORRECT_PARAM",
          message: "attending is not a Boolean"
        });
      }
    })
  }

  if (err.length > 0){
    res.status(500).send(err)
  }else {
    invite.email = req.body.email
    invite.confirmed = true
    invite.save().then(() => {
      req.body.list.forEach((g, i) => {
        guests[i].name = g.name
        guests[i].attending = g.attending
        // I'm sure theres a better way then to save for each guest.
        guests[i].save().then(() => {
          res.send({
            code: 200,
            type: "UPDATED",
            message: "Invite was udpated"
          })
        })
      });
    })
  }
});

module.exports = router;
