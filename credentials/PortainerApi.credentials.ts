import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PortainerApi implements ICredentialType {
	name = 'portainerApi';
	displayName = 'Portainer API';
	documentationUrl = 'https://app.swaggerhub.com/apis/portainer/portainer-ce/2.26.1#/';
	properties: INodeProperties[] = [
    {
      displayName: "Server URL",
      name: "url",
      placeholder: "https://portainer.com",
      type: "string",
      default: "https://portainer.com",
      required: true,
    },
    {
      displayName: "Access Token",
      name: "accessToken",
      type: "string",
      default: "",
      required: true,
      typeOptions: { password: true },
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: {
        "X-API-Key": "={{$credentials.accessToken}}",
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: "={{$credentials.url}}/api",
      url: "/system/info",
    },
  };
}
