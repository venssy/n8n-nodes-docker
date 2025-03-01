import {
  ILoadOptionsFunctions,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from "n8n-workflow";
import {
  N8NPropertiesBuilder,
  N8NPropertiesBuilderConfig,
} from "@devlikeapro/n8n-openapi-node";
import { fixOpenApi } from "../utils";
import * as doc from "./openapi.json";
import { portainerEndpoint } from "./descriptions";
import { portainerApiRequest } from "./GeniricFunctions";

fixOpenApi(doc);

const config: N8NPropertiesBuilderConfig = {};
const parser = new N8NPropertiesBuilder(doc, config);
const properties = parser.build();

export class Docker implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Docker",
    name: "docker",
    icon: "file:docker.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: "Interact with Docker via Portainer API",
    defaults: {
      name: "Docker",
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: "portainerApi",
        required: true,
      },
    ],
    requestDefaults: {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      baseURL: "={{$credentials.url}}/api/endpoints/{{$parameter['endpointId']}}/docker",
    },
    properties: [
      portainerEndpoint,
      ...properties
    ]
  };

  methods = {
    loadOptions: {
			async getEndpoints(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];

        const endpoints = await portainerApiRequest.call(this, 'GET', "/api/endpoints") as Array<{ Name: string, Id: number }>
				for (const user of endpoints) {
					returnData.push({
						name: user.Name,
						value: user.Id,
					});
				}

				returnData.sort((a, b) => {
					if (a.name < b.name) {
						return -1;
					}
					if (a.name > b.name) {
						return 1;
					}
					return 0;
				});

				return returnData;
			}
		}
  }
}