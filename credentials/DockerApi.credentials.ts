import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DockerApi implements ICredentialType {
	name = 'dockerApi';
	displayName = 'Docker API';
	documentationUrl = 'https://app.swaggerhub.com/apis/portainer/portainer-ce/2.26.1#/';
	properties: INodeProperties[] = [
    {
      displayName: "Server URL",
      name: "url",
      placeholder: "https://docker.com",
      type: "string",
      default: "https://docker.com",
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
    {
      displayName: "EndPoint ID",
      name: "endpointid",
      type: "number",
      default: "0",
      required: true,
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
      baseURL: "={{$credentials.url}}/api/endpoints/{{$credentials.endpointid}}",
      url: "",
    },
  };
}
