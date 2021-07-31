const model = require(__dirname + '/../models');

module.exports = function (router) {
	router.param('inviteCode', function (req, res, next, name) {
		model.Invite.findOne({
			where: {
				code: req.params.inviteCode
			}
		}).then(invite => {
			req.invite = invite
			model.Guests.findAll({
				where: {
					inviteId: invite.id
				}
			}).then(guests => {
				req.guests = guests
				next()
			})
		}).catch(err => {
			res.status(404).send([{
				code: 404,
				type: "NOT_FOUND",
				message: "Invite Code was not found"
			}]);
		})
	});
}
