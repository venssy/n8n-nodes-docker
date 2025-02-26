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

export class Portainer implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Portainer",
    name: "portainer",
    icon: "file:portainer.svg",
    group: ["transform"],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: "Interact with Portainer via API",
    defaults: {
      name: "Portainer",
    },
    inputs: '={{"main"}}',
    outputs: '={{"main"}}',
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
      baseURL: "={{$credentials.url}}/api",
    },
    properties: properties,
  };
}