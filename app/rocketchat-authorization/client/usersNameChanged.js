import { Meteor } from 'meteor/meteor';
import { Notifications } from '/app/rocketchat-notifications';
import { RoomRoles } from '/app/rocketchat-models';

Meteor.startup(function() {
	Notifications.onLogged('Users:NameChanged', function({ _id, name }) {
		RoomRoles.update({
			'u._id': _id,
		}, {
			$set: {
				'u.name': name,
			},
		}, {
			multi: true,
		});
	});
});
