import { Meteor } from 'meteor/meteor';
import { Permissions } from '/app/rocketchat-models';

Meteor.startup(() => {
	if (Permissions) {
		if (!Permissions.findOne({ _id: 'auto-translate' })) {
			Permissions.insert({ _id: 'auto-translate', roles: ['admin'] });
		}
	}
});
