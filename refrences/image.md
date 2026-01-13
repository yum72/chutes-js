# Chutes Image Models Schemas

## Hunyuan Image 3 (hunyuan-image-3)

### Example
```sh
curl -X POST \
		https://chutes-hunyuan-image-3.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "prompt": "A brown and white dog is running on the grass"
  }'
```

### Schema
```json
{
  "method": "POST",
  "path": "/generate",
  "function": "generate",
  "stream": false,
  "passthrough": false,
  "public_api_path": "/generate",
  "public_api_method": "POST",
  "input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/GenerationInput"
      }
    },
    "definitions": {
      "GenerationInput": {
        "type": "object",
        "required": [
          "prompt"
        ],
        "properties": {
          "seed": {
            "anyOf": [
              {
                "type": "integer",
                "maximum": 4294967295,
                "minimum": 0
              },
              {
                "type": "null"
              }
            ],
            "title": "Seed",
            "default": null
          },
          "size": {
            "type": "string",
            "title": "Size",
            "default": "auto",
            "description": "Image resolution (auto, WxH like 1280x768, or aspect ratio like 16:9)"
          },
          "steps": {
            "type": "integer",
            "title": "Steps",
            "default": 50,
            "maximum": 100,
            "minimum": 10
          },
          "prompt": {
            "type": "string",
            "title": "Prompt"
    }
  }
}
```

## Qwen-Image-2512 (Qwen-Image-2512)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "Qwen-Image-2512",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```

## JuggernautXL-Ragnarok (JuggernautXL-Ragnarok)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "JuggernautXL-Ragnarok",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```

## FLUX.1-schnell (FLUX.1-schnell)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "FLUX.1-schnell",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```

## NovaFurryXL (NovaFurryXL)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "NovaFurryXL",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```

## stabilityai/stable-diffusion-xl-base-1.0 (stable-diffusion-xl-base-1.0)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "stabilityai/stable-diffusion-xl-base-1.0",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```

## Lykon/dreamshaper-xl-1-0 (dreamshaper-xl-1-0)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "Lykon/dreamshaper-xl-1-0",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```

## diagonalge/Booba (Booba)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "diagonalge/Booba",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```

## diagonalge/ConstShaper (ConstShaper)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "diagonalge/ConstShaper",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```

## Qwen-Image-Edit-2511 (Qwen-Image-Edit-2511)
### Example
```sh
curl -X POST \
		https://chutes-qwen-image-edit-2511.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "seed": null,
    "width": 1024,
    "height": 1024,
    "prompt": "example-string",
    "image_b64s": [
      "example-string"
    ],
    "true_cfg_scale": 4,
    "negative_prompt": "",
    "num_inference_steps": 40
  }'
```

## Qwen Image Edit 2509 (qwen-image-edit-2509)

### Example
```sh
curl -X POST \
		https://chutes-qwen-image-edit-2509.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "seed": null,
    "width": 1024,
    "height": 1024,
    "prompt": "example-string",
    "image_b64s": [
      "example-string"
    ],
    "true_cfg_scale": 4,
    "negative_prompt": "",
    "num_inference_steps": 40
  }'
```

### Schema
```json
{
  "method": "POST",
  "path": "/generate",
  "function": "generate",
  "stream": false,
  "passthrough": false,
  "public_api_path": "/generate",
  "public_api_method": "POST",
  "input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/GenerationInput"
      }
    },
    "definitions": {
      "GenerationInput": {
        "type": "object",
        "required": [
          "prompt",
          "image_b64s"
        ],
        "properties": {
          "seed": {
            "anyOf": [
              {
                "type": "integer",
                "maximum": 4294967295,
                "minimum": 0
              },
              {
                "type": "null"
              }
            ],
            "title": "Seed",
            "default": null
          },
          "width": {
            "type": "integer",
            "title": "Width",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "height": {
            "type": "integer",
            "title": "Height",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "prompt": {
            "type": "string",
            "title": "Prompt"
          },
          "image_b64s": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "title": "Image B64S",
            "maxItems": 3,
            "minItems": 1
          },
          "true_cfg_scale": {
            "type": "number",
            "title": "True Cfg Scale",
            "default": 4,
            "maximum": 10,
            "minimum": 0
          },
          "negative_prompt": {
            "type": "string",
            "title": "Negative Prompt",
            "default": ""
          },
          "num_inference_steps": {
            "type": "integer",
            "title": "Num Inference Steps",
            "default": 40,
            "maximum": 100,
            "minimum": 5
          }
        }
      }
    }
  },
  "output_schema": {},
  "output_content_type": "image/jpeg",
  "minimal_input_schema": null
}
```
### Qwen Image (qwen-image)

### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "qwen-image",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```
### Schema
```json
{
  "method": "POST",
  "path": "/generate",
  "function": "generate",
  "stream": false,
  "passthrough": false,
  "public_api_path": "/generate",
  "public_api_method": "POST",
  "input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/GenerationInput"
      }
    },
    "definitions": {
      "GenerationInput": {
        "type": "object",
        "required": [
          "prompt"
        ],
        "properties": {
          "seed": {
            "anyOf": [
              {
                "type": "integer",
                "maximum": 4294967295,
                "minimum": 0
              },
              {
                "type": "null"
              }
            ],
            "title": "Seed",
            "default": null
          },
          "width": {
            "type": "integer",
            "title": "Width",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "height": {
            "type": "integer",
            "title": "Height",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "prompt": {
            "type": "string",
            "title": "Prompt"
          },
          "true_cfg_scale": {
            "type": "number",
            "title": "True Cfg Scale",
            "default": 4,
            "maximum": 10,
            "minimum": 0
          },
          "negative_prompt": {
            "type": "string",
            "title": "Negative Prompt",
            "default": ""
          },
          "num_inference_steps": {
            "type": "integer",
            "title": "Num Inference Steps",
            "default": 50,
            "maximum": 100,
            "minimum": 5
          }
        }
      }
    }
  },
  "output_schema": {},
  "output_content_type": "image/jpeg",
  "minimal_input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/MinifiedGenerationInput"
      }
    },
    "definitions": {
      "MinifiedGenerationInput": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "title": "Prompt",
            "default": "a beautiful mountain landscape"
          }
        }
      }
    }
  }
}
```

## Hidream (hidream)
### Example
```sh
curl -X POST \
		https://chutes-hidream.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "seed": null,
    "prompt": "example-string",
    "resolution": "1024x1024",
    "guidance_scale": 5,
    "num_inference_steps": 50
  }'
```
### Schema
```json
{
  "method": "POST",
  "path": "/generate",
  "function": "generate",
  "stream": false,
  "passthrough": false,
  "public_api_path": "/generate",
  "public_api_method": "POST",
  "input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/GenerationInput"
      }
    },
    "definitions": {
      "GenerationInput": {
        "type": "object",
        "required": [
          "prompt"
        ],
        "properties": {
          "seed": {
            "anyOf": [
              {
                "type": "integer",
                "maximum": 100000000,
                "minimum": 0
              },
              {
                "type": "null"
              }
            ],
            "title": "Seed",
            "default": null
          },
          "prompt": {
            "type": "string",
            "title": "Prompt"
          },
          "resolution": {
            "anyOf": [
              {
                "enum": [
                  "1024x1024",
                  "768x1360",
                  "1360x768",
                  "880x1168",
                  "1168x880",
                  "1248x832",
                  "832x1248"
                ],
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Resolution",
            "default": "1024x1024"
          },
          "guidance_scale": {
            "anyOf": [
              {
                "type": "number",
                "maximum": 10,
                "minimum": 0
              },
              {
                "type": "null"
              }
            ],
            "title": "Guidance Scale",
            "default": 5
          },
          "num_inference_steps": {
            "anyOf": [
              {
                "type": "integer",
                "maximum": 75,
                "minimum": 5
              },
              {
                "type": "null"
              }
            ],
            "title": "Num Inference Steps",
            "default": 50
          }
        }
      }
    }
  },
  "output_schema": null,
  "output_content_type": null,
  "minimal_input_schema": null
}
```

## JuggernautXL (JuggernautXL)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "JuggernautXL",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```
### Schema
```json
{
  "method": "POST",
  "path": "/generate",
  "function": "generate",
  "stream": false,
  "passthrough": false,
  "public_api_path": "/generate",
  "public_api_method": "POST",
  "input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/GenerationInput"
      }
    },
    "definitions": {
      "GenerationInput": {
        "type": "object",
        "required": [
          "prompt"
        ],
        "properties": {
          "seed": {
            "anyOf": [
              {
                "type": "integer",
                "maximum": 4294967295,
                "minimum": 0
              },
              {
                "type": "null"
              }
            ],
            "title": "Seed",
            "default": null
          },
          "width": {
            "type": "integer",
            "title": "Width",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "height": {
            "type": "integer",
            "title": "Height",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "prompt": {
            "type": "string",
            "title": "Prompt"
          },
          "guidance_scale": {
            "type": "number",
            "title": "Guidance Scale",
            "default": 7.5,
            "maximum": 20,
            "minimum": 1
          },
          "negative_prompt": {
            "type": "string",
            "title": "Negative Prompt",
            "default": ""
          },
          "num_inference_steps": {
            "type": "integer",
            "title": "Num Inference Steps",
            "default": 25,
            "maximum": 50,
            "minimum": 1
          }
        }
      }
    }
  },
  "output_schema": {},
  "output_content_type": "image/jpeg",
  "minimal_input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/MinifiedGenerationInput"
      }
    },
    "definitions": {
      "MinifiedGenerationInput": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "title": "Prompt",
            "default": "a beautiful mountain landscape"
          }
        }
      }
    }
  }
}
```
## iLustMix (iLustMix)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "iLustMix",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```
### Schema
```json
{
  "method": "POST",
  "path": "/generate",
  "function": "generate",
  "stream": false,
  "passthrough": false,
  "public_api_path": "/generate",
  "public_api_method": "POST",
  "input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/GenerationInput"
      }
    },
    "definitions": {
      "GenerationInput": {
        "type": "object",
        "required": [
          "prompt"
        ],
        "properties": {
          "seed": {
            "anyOf": [
              {
                "type": "integer",
                "maximum": 4294967295,
                "minimum": 0
              },
              {
                "type": "null"
              }
            ],
            "title": "Seed",
            "default": null
          },
          "width": {
            "type": "integer",
            "title": "Width",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "height": {
            "type": "integer",
            "title": "Height",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "prompt": {
            "type": "string",
            "title": "Prompt"
          },
          "guidance_scale": {
            "type": "number",
            "title": "Guidance Scale",
            "default": 7.5,
            "maximum": 20,
            "minimum": 1
          },
          "negative_prompt": {
            "type": "string",
            "title": "Negative Prompt",
            "default": ""
          },
          "num_inference_steps": {
            "type": "integer",
            "title": "Num Inference Steps",
            "default": 25,
            "maximum": 50,
            "minimum": 1
          }
        }
      }
    }
  },
  "output_schema": {},
  "output_content_type": "image/jpeg",
  "minimal_input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/MinifiedGenerationInput"
      }
    },
    "definitions": {
      "MinifiedGenerationInput": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "title": "Prompt",
            "default": "a beautiful mountain landscape"
          }
        }
      }
    }
  }
}
```

## Chroma (chroma)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "chroma",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```
### Schema
```json
{
  "method": "POST",
  "path": "/generate",
  "function": "generate",
  "stream": false,
  "passthrough": false,
  "public_api_path": "/generate",
  "public_api_method": "POST",
  "input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/TextToImagePayload"
      }
    },
    "definitions": {
      "TextToImagePayload": {
        "type": "object",
        "required": [
          "prompt"
        ],
        "properties": {
          "cfg": {
            "gte": 1,
            "lte": 7.5,
            "anyOf": [
              {
                "type": "number"
              },
              {
                "type": "null"
              }
            ],
            "title": "CFG Scale",
            "default": 4.5,
            "description": "CFG Scale for text generation."
          },
          "seed": {
            "gte": 0,
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Seed",
            "default": 0,
            "description": "Seed for text generation."
          },
          "steps": {
            "gte": 5,
            "lte": 50,
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Steps",
            "default": 30,
            "description": "Steps for text generation."
          },
          "width": {
            "lte": 2048,
            "anyOf": [
              {
                "type": "integer",
                "minimum": 200
              },
              {
                "type": "null"
              }
            ],
            "title": "Width",
            "default": 1024,
            "description": "Width for text generation."
          },
          "height": {
            "lte": 2048,
            "anyOf": [
              {
                "type": "integer",
                "minimum": 200
              },
              {
                "type": "null"
              }
            ],
            "title": "Height",
            "default": 1024,
            "description": "Height for text generation."
          },
          "prompt": {
            "type": "string",
            "title": "Prompt"
          }
        }
      }
    }
  },
  "output_schema": {},
  "output_content_type": "image/jpeg",
  "minimal_input_schema": null
}
```
## Illustrij (Illustrij)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "Illustrij",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```
### Schema
```json
{
  "method": "POST",
  "path": "/generate",
  "function": "generate",
  "stream": false,
  "passthrough": false,
  "public_api_path": "/generate",
  "public_api_method": "POST",
  "input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/GenerationInput"
      }
    },
    "definitions": {
      "GenerationInput": {
        "type": "object",
        "required": [
          "prompt"
        ],
        "properties": {
          "seed": {
            "anyOf": [
              {
                "type": "integer",
                "maximum": 4294967295,
                "minimum": 0
              },
              {
                "type": "null"
              }
            ],
            "title": "Seed",
            "default": null
          },
          "width": {
            "type": "integer",
            "title": "Width",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "height": {
            "type": "integer",
            "title": "Height",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "prompt": {
            "type": "string",
            "title": "Prompt"
          },
          "guidance_scale": {
            "type": "number",
            "title": "Guidance Scale",
            "default": 7.5,
            "maximum": 20,
            "minimum": 1
          },
          "negative_prompt": {
            "type": "string",
            "title": "Negative Prompt",
            "default": ""
          },
          "num_inference_steps": {
            "type": "integer",
            "title": "Num Inference Steps",
            "default": 25,
            "maximum": 50,
            "minimum": 1
          }
        }
      }
    }
  },
  "output_schema": {},
  "output_content_type": "image/jpeg",
  "minimal_input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/MinifiedGenerationInput"
      }
    },
    "definitions": {
      "MinifiedGenerationInput": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "title": "Prompt",
            "default": "a beautiful mountain landscape"
          }
        }
      }
    }
  }
}
```

## Animij (Animij)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "Animij",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```
### Schema
```json
{
  "method": "POST",
  "path": "/generate",
  "function": "generate",
  "stream": false,
  "passthrough": false,
  "public_api_path": "/generate",
  "public_api_method": "POST",
  "input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/GenerationInput"
      }
    },
    "definitions": {
      "GenerationInput": {
        "type": "object",
        "required": [
          "prompt"
        ],
        "properties": {
          "seed": {
            "anyOf": [
              {
                "type": "integer",
                "maximum": 4294967295,
                "minimum": 0
              },
              {
                "type": "null"
              }
            ],
            "title": "Seed",
            "default": null
          },
          "width": {
            "type": "integer",
            "title": "Width",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "height": {
            "type": "integer",
            "title": "Height",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "prompt": {
            "type": "string",
            "title": "Prompt"
          },
          "guidance_scale": {
            "type": "number",
            "title": "Guidance Scale",
            "default": 7.5,
            "maximum": 20,
            "minimum": 1
          },
          "negative_prompt": {
            "type": "string",
            "title": "Negative Prompt",
            "default": ""
          },
          "num_inference_steps": {
            "type": "integer",
            "title": "Num Inference Steps",
            "default": 25,
            "maximum": 50,
            "minimum": 1
          }
        }
      }
    }
  },
  "output_schema": {},
  "output_content_type": "image/jpeg",
  "minimal_input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/MinifiedGenerationInput"
      }
    },
    "definitions": {
      "MinifiedGenerationInput": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "title": "Prompt",
            "default": "a beautiful mountain landscape"
          }
        }
      }
    }
  }
}
```

## HassakuXL (HassakuXL)
### Example
```sh
curl -X POST \
		https://image.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "model": "HassakuXL",
    "prompt": "A beautiful sunset over mountains",
    "negative_prompt": "blur, distortion, low quality",
    "guidance_scale": 7.5,
    "width": 1024,
    "height": 1024,
    "num_inference_steps": 50
  }'
```
### Schema
```json
{
  "method": "POST",
  "path": "/generate",
  "function": "generate",
  "stream": false,
  "passthrough": false,
  "public_api_path": "/generate",
  "public_api_method": "POST",
  "input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/GenerationInput"
      }
    },
    "definitions": {
      "GenerationInput": {
        "type": "object",
        "required": [
          "prompt"
        ],
        "properties": {
          "seed": {
            "anyOf": [
              {
                "type": "integer",
                "maximum": 4294967295,
                "minimum": 0
              },
              {
                "type": "null"
              }
            ],
            "title": "Seed",
            "default": null
          },
          "width": {
            "type": "integer",
            "title": "Width",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "height": {
            "type": "integer",
            "title": "Height",
            "default": 1024,
            "maximum": 2048,
            "minimum": 128
          },
          "prompt": {
            "type": "string",
            "title": "Prompt"
          },
          "guidance_scale": {
            "type": "number",
            "title": "Guidance Scale",
            "default": 7.5,
            "maximum": 20,
            "minimum": 1
          },
          "negative_prompt": {
            "type": "string",
            "title": "Negative Prompt",
            "default": ""
          },
          "num_inference_steps": {
            "type": "integer",
            "title": "Num Inference Steps",
            "default": 25,
            "maximum": 50,
            "minimum": 1
          }
        }
      }
    }
  },
  "output_schema": {},
  "output_content_type": "image/jpeg",
  "minimal_input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/MinifiedGenerationInput"
      }
    },
    "definitions": {
      "MinifiedGenerationInput": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "title": "Prompt",
            "default": "a beautiful mountain landscape"
          }
        }
      }
    }
  }
}
```

## Z Image Turbo (z-image-turbo)

### Example
```sh
curl -X POST \
		https://chutes-z-image-turbo.chutes.ai/generate \
		-H "Authorization: Bearer $CHUTES_API_TOKEN" \
	-H "Content-Type: application/json" \
	-d '  {
    "prompt": "a high quality photo of a sunrise over the mountains"
  }'
```

### Schema
```json
{
  "method": "POST",
  "path": "/generate",
  "function": "generate",
  "stream": false,
  "passthrough": false,
  "public_api_path": "/generate",
  "public_api_method": "POST",
  "input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/GenerateInput"
      }
    },
    "definitions": {
      "GenerateInput": {
        "type": "object",
        "required": [
          "prompt"
        ],
        "properties": {
          "seed": {
            "anyOf": [
              {
                "type": "integer",
                "maximum": 4294967295,
                "minimum": 0
              },
              {
                "type": "null"
              }
            ],
            "title": "Seed",
            "default": null
          },
          "shift": {
            "type": "number",
            "title": "Shift",
            "default": 3,
            "maximum": 10,
            "minimum": 1
          },
          "width": {
            "type": "integer",
            "title": "Width",
            "default": 1024,
            "maximum": 2048,
            "minimum": 576
          },
          "height": {
            "type": "integer",
            "title": "Height",
            "default": 1024,
            "maximum": 2048,
            "minimum": 576
          },
          "prompt": {
            "type": "string",
            "title": "Prompt",
            "maxLength": 1200,
            "minLength": 3
          },
          "guidance_scale": {
            "type": "number",
            "title": "Guidance Scale",
            "default": 0,
            "maximum": 5,
            "minimum": 0
          },
          "max_sequence_length": {
            "type": "integer",
            "title": "Max Sequence Length",
            "default": 512,
            "maximum": 2048,
            "minimum": 256
          },
          "num_inference_steps": {
            "type": "integer",
            "title": "Num Inference Steps",
            "default": 9,
            "maximum": 100,
            "minimum": 1
          }
        }
      }
    }
  },
  "output_schema": {},
  "output_content_type": "image/png",
  "minimal_input_schema": {
    "type": "object",
    "required": [
      "input_args"
    ],
    "properties": {
      "input_args": {
        "$ref": "#/definitions/MinimalGenerateInput"
      }
    },
    "definitions": {
      "MinimalGenerateInput": {
        "type": "object",
        "properties": {
          "prompt": {
            "type": "string",
            "title": "Prompt",
            "default": "a high quality photo of a sunrise over the mountains"
          }
        }
      }
    }
  }
}
```