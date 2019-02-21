import { Meteor } from 'meteor/meteor';
import { hasPermission } from '/app/rocketchat-authorization';
import { Users, Integrations } from '/app/rocketchat-models';
import { integrations } from '../../../lib/rocketchat';

Meteor.methods({
	addOutgoingIntegration(integration) {
		if (!hasPermission(this.userId, 'manage-integrations')
			&& !hasPermission(this.userId, 'manage-own-integrations')
			&& !hasPermission(this.userId, 'manage-integrations', 'bot')
			&& !hasPermission(this.userId, 'manage-own-integrations', 'bot')) {
			throw new Meteor.Error('not_authorized');
		}

		integration = integrations.validateOutgoing(integration, this.userId);

		integration._createdAt = new Date();
		integration._createdBy = Users.findOne(this.userId, { fields: { username: 1 } });
		integration._id = Integrations.insert(integration);

		return integration;
	},
});