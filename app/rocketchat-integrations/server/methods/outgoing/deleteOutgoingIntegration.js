import { Meteor } from 'meteor/meteor';
import { hasPermission } from '/app/rocketchat-authorization';
import { IntegrationHistory, Integrations } from '/app/rocketchat-models';

Meteor.methods({
	deleteOutgoingIntegration(integrationId) {
		let integration;

		if (hasPermission(this.userId, 'manage-integrations') || hasPermission(this.userId, 'manage-integrations', 'bot')) {
			integration = Integrations.findOne(integrationId);
		} else if (hasPermission(this.userId, 'manage-own-integrations') || hasPermission(this.userId, 'manage-own-integrations', 'bot')) {
			integration = Integrations.findOne(integrationId, { fields: { '_createdBy._id': this.userId } });
		} else {
			throw new Meteor.Error('not_authorized', 'Unauthorized', { method: 'deleteOutgoingIntegration' });
		}

		if (!integration) {
			throw new Meteor.Error('error-invalid-integration', 'Invalid integration', { method: 'deleteOutgoingIntegration' });
		}

		Integrations.remove({ _id: integrationId });
		IntegrationHistory.removeByIntegrationId(integrationId);

		return true;
	},
});
