# Chutes Video Models Schemas

## Wan2.2 I2V 14B Fast (wan-2-2-i2v-14b-fast)

Image-to-Video generation model.

### Example

```sh
curl -X POST \
  https://chutes-wan-2-2-i2v-14b-fast.chutes.ai/generate \
  -H "Authorization: Bearer $CHUTES_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fps": 16,
    "image": "https://example.com/image.jpg",
    "prompt": "animals run to drink water from lake",
    "resolution": "480p"
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
    "required": ["prompt", "image"],
    "properties": {
      "fps": {
        "max": 24,
        "min": 16,
        "anyOf": [
          { "type": "integer" },
          { "type": "null" }
        ],
        "title": "Fps",
        "default": 16,
        "description": "FPS"
      },
      "fast": {
        "anyOf": [
          { "type": "boolean" },
          { "type": "null" }
        ],
        "title": "Fast",
        "default": true,
        "description": "Ultra fast pruna mode"
      },
      "seed": {
        "anyOf": [
          { "type": "integer" },
          { "type": "null" }
        ],
        "title": "Seed",
        "default": null,
        "description": "Generation seed."
      },
      "image": {
        "type": "string",
        "title": "Image",
        "description": "Image, either https URL or base64 encoded data."
      },
      "frames": {
        "max": 140,
        "min": 21,
        "type": "integer",
        "title": "Frames",
        "default": 81,
        "description": "Number of frames to generate."
      },
      "prompt": {
        "type": "string",
        "title": "Prompt",
        "maxLength": 16384,
        "minLength": 3,
        "description": "Prompt for the image-2-video task."
      },
      "resolution": {
        "anyOf": [
          {
            "enum": ["480p", "720p"],
            "type": "string"
          },
          { "type": "null" }
        ],
        "title": "Resolution",
        "default": "480p"
      },
      "guidance_scale": {
        "max": 10,
        "min": 0,
        "anyOf": [
          { "type": "number" },
          { "type": "null" }
        ],
        "title": "Guidance Scale",
        "default": 1,
        "description": "Guidance scale."
      },
      "negative_prompt": {
        "anyOf": [
          { "type": "string" },
          { "type": "null" }
        ],
        "title": "Negative Prompt",
        "default": "色调艳丽，过曝，静态，细节模糊不清，字幕，风格，作品，画作，画面，静止，整体发灰，最差质量，低质量，JPEG压缩残留，丑陋的，残缺的，多余的手指，画得不好的手部，画得不好的脸部，畸形的，毁容的，形态畸形的肢体，手指融合，静止不动的画面，杂乱的背景，三条腿，背景人很多，倒着走",
        "description": "Negative prompt."
      },
      "guidance_scale_2": {
        "max": 10,
        "min": 0,
        "anyOf": [
          { "type": "number" },
          { "type": "null" }
        ],
        "title": "Guidance Scale 2",
        "default": 1,
        "description": "Guidance scale 2."
      }
    }
  },
  "output_schema": null,
  "output_content_type": "video/mp4",
  "minimal_input_schema": null
}
```
