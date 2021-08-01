const model = require(__dirname + '/../models');

module.exports = function (router) {
	router.param('inviteCode', function (req, res, next, name) {
		model.Invite.findOne({
			where: {
				code: req.params.inviteCode
			}
		}).then(invite => {
			if (invite) {
				req.invite = invite
				model.Guests.findAll({
					where: {
						inviteId: invite.id
					}
				}).then(guests => {
					req.guests = guests
					next()
				}).catch(err => {
					err.code = 404;
					err.type = "DB_ERROR"
					err.customMessage = "Something went wrong querying for guests in party"
					next(err)
				})
			} else {
				err = new Error()
				err.code = 404;
				err.type = "NOT_FOUND"
				err.customMessage = "Invite Code was not found"
				next(err)
			}
		}).catch(err => {
			err.code = 500;
			next(err)
		})
	});
}
