import { HTTP } from 'meteor/http';
import { settings } from '/app/rocketchat-settings';
import { Settings } from '/app/rocketchat-models';

import { getWorkspaceAccessToken } from './getWorkspaceAccessToken';

export function getWorkspaceLicense() {
	const token = getWorkspaceAccessToken();

	if (!token) {
		return { updated: false, license: '' };
	}


	let licenseResult;
	try {
		licenseResult = HTTP.get(`${ settings.get('Cloud_Workspace_Registration_Client_Uri') }/license`, {
			headers: {
				Authorization: `Bearer ${ token }`,
			},
		});
	} catch (e) {
		return { updated: false, license: '' };
	}

	const remoteLicense = licenseResult.data;
	const currentLicense = settings.get('Cloud_Workspace_License');

	if (remoteLicense.updatedAt <= currentLicense._updatedAt) {
		return { updated: false, license: '' };
	}

	Settings.updateValueById('Cloud_Workspace_License', remoteLicense.license);

	return { updated: true, license: remoteLicense.license };
}
