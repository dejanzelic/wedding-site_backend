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
  invite = req.invite
  guests = req.guests
  err = [];
  if (!req.body.email) {
    err = new Error()
    err.code = 500;
    err.type = "MISSING_PARAM"
    err.customMessage = "The 'email' paramater is missing"
    return next(err)
  }
  if (!req.body.list) {
    err = new Error()
    err.code = 500;
    err.type = "MISSING_PARAM"
    err.customMessage = "The 'list' paramater is missing"
    return next(err)
  } else if (!Array.isArray(req.body.list)) {
    err = new Error()
    err.code = 500;
    err.type = "INCORRECT_PARAM"
    err.customMessage = "Incorrect property type. List is expected to be an Array"
    return next(err)
  } else if (req.body.list.length !== guests.length) {
    err = new Error()
    err.code = 500;
    err.type = "INCORRECT_LENGTH"
    err.customMessage = "Guest length not as expected"
    return next(err)
  } else {
    req.body.list.forEach(g => {
      if (typeof g.attending !== "boolean") {
        err = new Error()
        err.code = 500;
        err.type = "INCORRECT_PARAM"
        err.customMessage = "attending is not a Boolean"
        return next(err)
      }
    })
  }

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
          type: "SUCCESS",
          message: "Invite was udpated"
        })
      })
    });
  })
});

module.exports = router;
