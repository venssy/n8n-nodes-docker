import {
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from "n8n-workflow";
import {
  N8NPropertiesBuilder,
  N8NPropertiesBuilderConfig,
} from "@devlikeapro/n8n-openapi-node";
import * as doc from "./openapi.json";
import { fixOpenApi } from "../utils";
/*
for (let _path in doc["paths"] as any) {
  let path = (doc["paths"] as any)[_path]
  for (let _method in path) {
    if (_path == "/configs/{id}/update" && _method == "post" || true) {
      //console.log("path", _path)
      // console.log("parameters", path[_method]["parameters"].length)
      if (path[_method]["parameters"] && path[_method]["parameters"].length > 0) {
        //console.log("_parameter " + path[_method]["parameters"].length)
        for (var _parameter = path[_method]["parameters"].length - 1; _parameter >= 0; _parameter--) {
          //console.log("_parameter " + _parameter)
          let parameter = path[_method]["parameters"][_parameter]
          //console.log(_method, parameter["type"], JSON.stringify(parameter))

          // console.log(parameter["name"], parameter["in"])
          if (parameter["name"] === "version" && parameter["in"] === "query") {
            //console.log("version query parameter")
            path[_method]["parameters"].splice(_parameter, 1)
          } else if (parameter["in"] == "body") {
            path["requestBody"] = {
              "content": {
                "application/json": {
                  "schema": parameter["schema"]
                }
              },
              "required": parameter["required"] || false
            }
            path[_method]["parameters"].splice(_parameter, 1)
            // delete path[_method]["parameters"][_parameter]
          } else {
            // console.log(_method, _parameter, parameter["type"], JSON.stringify(parameter))
            if (parameter["type"]) {
              // console.log(JSON.stringify(parameter))
              if (!parameter["schema"]) {
                parameter["schema"] = {}
              }
              parameter["schema"]["type"] = parameter["type"]
            }
          }
        }

        // console.log(JSON.stringify(path))

        // exit(0)
      }
    }
    // exit(0)
  }
}*/

// console.log(doc["definitions"]["webhookswebhookUpdatePayload"])

fixOpenApi(doc)

const config: N8NPropertiesBuilderConfig = {};
const parser = new N8NPropertiesBuilder(doc, config);
const properties = parser.build();

export class DockerApi implements INodeType {
  description: INodeTypeDescription = {
    displayName: "Docker",
    name: "docker",
    icon: "file:docker.png",
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