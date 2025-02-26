import {
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";
import {
  N8NPropertiesBuilder,
  N8NPropertiesBuilderConfig,
} from "@devlikeapro/n8n-openapi-node";
import { fixOpenApi } from "../utils";
import * as doc from "./openapi.json";

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
    inputs: '={{"main"}}',
    outputs: '={{"main"}}',
    credentials: [
      {
        name: "dockerApi",
        required: true,
      },
    ],
    requestDefaults: {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      baseURL: "={{$credentials.url}}/api/endpoints/{{$credentials.endpointid}}/docker",
    },
    properties: properties
  };
}