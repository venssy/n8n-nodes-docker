import type { INodeProperties } from 'n8n-workflow';

export const portainerEndpoint: INodeProperties = {
	displayName: 'EndpointID Name or ID',
	name: 'endpointId',
	type: 'options',
	default: '',
	description: 'The endpointId which will use to access . <a href="https://docs.portainer.io/api/examples">expression</a>. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	typeOptions: {
		loadOptionsMethod: 'getEndpoints',
	},
	required: true,
};
