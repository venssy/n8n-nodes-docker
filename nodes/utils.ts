export function fixOpenApi(doc: any) {
  for (let _path in doc["paths"] as any) {
    let path = (doc["paths"] as any)[_path]
    for (let _method in path) {
      if (_path == "/session" && _method == "post" || true) {
        if (path[_method]["parameters"] != undefined && path[_method]["parameters"].length > 0) {

          path[_method]["parameters"] = path[_method]["parameters"].map((parameter: any) => {
            if (parameter["type"]) {
              if (parameter["type"] == "file") {
                parameter["type"] = "string"
                parameter["format"] = "binary"
              }else {
                if (!parameter["schema"]) {
                  parameter["schema"] = {}
                }
                parameter["schema"]["type"] = parameter["type"]
              }
            }
            return parameter
          })

          let consumes = path[_method]["consumes"] as Array<string>
          let bodys = path[_method]["parameters"].filter((item: any) => item["in"] == "body")
          let formDatas = path[_method]["parameters"].filter((item: any) => item["in"] == "formData")
          path[_method]["parameters"] = path[_method]["parameters"].filter((item: any) =>
            item["in"] != "body" && item["in"] != "formData"
          )

          let requestBody = {
            "content": {} as any,
            "required": true,
            "flag": true
          } as any

          if (bodys.length == 1) {
            requestBody.required = bodys.find((item: any) => item["required"] == true) != undefined

            let properties = {} as any
            properties[bodys[0]["name"]] = {
              "type": "string",
              "format": "binary"
            }
            
            if (consumes != undefined && consumes.includes("application/octet-stream")) {
              requestBody.content["application/octet-stream"] = {
                "schema": {
                  "type": "object",
                  "properties": properties,
                }
              }
              delete requestBody.flag

            }
              if (consumes == undefined || consumes.includes("application/json") || true) {
                requestBody.content["application/json"] = {
                  "schema": bodys[0]["schema"]
                }
                delete requestBody.flag
              }
  
              if (consumes != undefined && consumes.includes("multipart/form-data")) {
                let properties = {} as any
                properties[bodys[0]["name"]] = bodys[0]
                requestBody.content["multipart/form-data"] = {
                  "schema": {
                    "type": "object",
                    "properties": properties,
                    "required": formDatas.filter((item: any) => item["required"] == true).map((item: any) => item["name"])
                  }
                }
                delete requestBody.flag
              }
            
          }

          if (formDatas.length > 0) {
            requestBody.required = formDatas.find((item: any) => item["required"] == true) != undefined

            if (consumes == undefined || consumes.includes("application/json") || true) {
              requestBody.content["application/json"] = {
                "schema": {
                  "type": "object",
                  "properties": formDatas.reduce((acc: any, item: any) => {
                    acc[item["name"]] = item
                    return acc
                  }, {}),
                  "required": formDatas.filter((item: any) => item["required"] == true).map((item: any) => item["name"])
                }
              }
              delete requestBody.flag
            }

            if (consumes != undefined && consumes.includes("multipart/form-data")) {
              requestBody.content["multipart/form-data"] = {
                "schema": {
                  "type": "object",
                  "properties": formDatas.reduce((acc: any, item: any) => {
                    acc[item["name"]] = item
                    return acc
                  }, {}),
                  "required": formDatas.filter((item: any) => item["required"] == true).map((item: any) => item["name"])
                }
              }
              delete requestBody.flag
            }
          }

          if (requestBody.flag == undefined) {
            path[_method]["requestBody"] = requestBody
          }
        }
      }
    }
  }
}