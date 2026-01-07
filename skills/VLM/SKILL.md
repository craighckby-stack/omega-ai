name: VLM
description: Implement vision-based AI chat capabilities using the z-ai-web-dev-sdk. Use this skill when the user needs to analyze images, describe visual content, or create applications that combine image understanding with conversational AI. Supports image URLs and base64 encoded images for multimodal interactions.
license: MIT
---

# VLM (Vision Chat) Skill Reference

This skill guides the implementation of vision chat functionality using the `z-ai-web-dev-sdk`, enabling AI models to understand and respond to images combined with text prompts.

## Skill Location

**Path**: `{project_path}/skills/VLM`

Reference scripts for testing are available in the `{Skill Location}/scripts/` directory (e.g., `{Skill Location}/scripts/vlm.ts`).

## Overview

Vision Chat allows you to build applications that analyze images, extract information from visual content, and answer questions about images through natural language conversation.

**IMPORTANT**: `z-ai-web-dev-sdk` MUST be used in backend code only. Never use it in client-side code.

## Prerequisites

The `z-ai-web-dev-sdk` package is already installed. Import it as shown in the examples below.

## CLI Usage (Simple Tasks)

For simple image analysis tasks, use the `z-ai CLI` for quick descriptions, testing, or simple automation.

### Basic Analysis

```bash
# Describe an image from URL
z-ai vision --prompt "What's in this image?" --image "https://example.com/photo.jpg"

# Using short options for local file analysis
z-ai vision -p "What objects are in this photo?" -i "./photo.jpg"
```

### Advanced Tasks

```bash
# Analyze multiple images
z-ai vision \
  -p "Compare these two images" \
  -i "./photo1.jpg" \
  -i "./photo2.jpg"

# Enable Chain-of-Thought reasoning
z-ai vision \
  -p "Count the people and describe their activities" \
  -i "./crowd.jpg" \
  --thinking

# Stream output and save to file
z-ai vision -p "Describe this image in detail" -i "./photo.jpg" --stream -o analysis.json
```

### CLI Parameters Summary

| Parameter | Alias | Required | Description |
| :--- | :--- | :--- | :--- |
| `--prompt` | `-p` | **Yes** | Question or instruction about the image(s) |
| `--image` | `-i` | Optional | Image URL or local file path (can be used multiple times) |
| `--thinking` | `-t` | Optional | Enable chain-of-thought reasoning (default: disabled) |
| `--output` | `-o` | Optional | Output file path (JSON format) |
| `--stream` | | Optional | Stream the response in real-time |

### When to Use CLI vs SDK

| Use Case | Recommended Tool |
| :--- | :--- |
| Quick image analysis / testing | CLI |
| One-off descriptions or simple scripts | CLI |
| Multi-turn conversations with visual context | SDK |
| Dynamic analysis in production applications | SDK |
| Batch processing with custom logic | SDK |

---

## Recommended Approach

For optimal performance and reliability, use base64 encoding to transmit image data directly to the model instead of relying on external image URLs.

## Supported Media Content Types

The Vision Chat API supports combining text prompts with various media types:

### 1. `image_url` (Static Images)
Use for PNG, JPEG, GIF, WebP, etc.
```typescript
{ type: 'image_url', image_url: { url: imageUrl } }
```

### 2. `video_url` (Video Files)
Use for MP4, AVI, MOV, etc.
```typescript
{ type: 'video_url', video_url: { url: videoUrl } }
```

### 3. `file_url` (Document Files)
Use for PDF, DOCX, TXT, etc.
```typescript
{ type: 'file_url', file_url: { url: fileUrl } }
```

**Note**: Multiple content types (e.g., text, multiple images, and a document) can be combined in a single user message.

## SDK Implementation

### Single Image Analysis

```javascript
import ZAI from 'z-ai-web-dev-sdk';

/**
 * Analyzes a single image URL based on a specific question.
 */
async function analyzeImage(imageUrl, question) {
  const zai = await ZAI.create();

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: question },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ],
    // Generally recommended to disable thinking unless complex reasoning is required
    thinking: { type: 'disabled' } 
  });

  return response.choices[0]?.message?.content;
}

// Usage
// const result = await analyzeImage('https://example.com/product.jpg', 'Describe this product in detail');
```

### Multiple Images Comparison

```javascript
import ZAI from 'z-ai-web-dev-sdk';

/**
 * Compares multiple images based on a user prompt.
 */
async function compareImages(imageUrls, question) {
  const zai = await ZAI.create();

  const content = [
    { type: 'text', text: question },
    ...imageUrls.map(url => ({
      type: 'image_url',
      image_url: { url }
    }))
  ];

  const response = await zai.chat.completions.createVision({
    messages: [{ role: 'user', content: content }],
    thinking: { type: 'disabled' }
  });

  return response.choices[0]?.message?.content;
}

// Usage
// const comparison = await compareImages(['url1', 'url2'], 'Compare the differences');
```

### Base64 Image Upload (Recommended for Local Files)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs'; // Requires Node.js filesystem module

/**
 * Analyzes a local image file by encoding it as base64 data URI.
 */
async function analyzeLocalImage(imagePath, question) {
  const zai = await ZAI.create();

  // Read file and encode
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  
  // Basic MIME type detection
  const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
  
  const dataUri = `data:${mimeType};base64,${base64Image}`;

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: question },
          { type: 'image_url', image_url: { url: dataUri } }
        ]
      }
    ],
    thinking: { type: 'disabled' }
  });

  return response.choices[0]?.message?.content;
}
```

## Advanced Use Cases

### Conversational Session Management

This class demonstrates maintaining chat history (`this.messages`) for multi-turn conversations where the image context persists.

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class VisionChatSession {
  constructor() {
    this.messages = [];
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async processRequest() {
    const response = await this.zai.chat.completions.createVision({
      messages: this.messages,
      thinking: { type: 'disabled' }
    });

    const assistantMessage = response.choices[0]?.message?.content;
    
    // Store assistant response for context
    this.messages.push({ role: 'assistant', content: assistantMessage });

    return assistantMessage;
  }
  
  async addImage(imageUrl, initialQuestion) {
    this.messages.push({
      role: 'user',
      content: [
        { type: 'text', text: initialQuestion },
        { type: 'image_url', image_url: { url: imageUrl } }
      ]
    });
    return this.processRequest();
  }

  async followUp(question) {
    this.messages.push({
      role: 'user',
      content: [{ type: 'text', text: question }]
    });
    return this.processRequest();
  }
}

// Usage:
// const session = new VisionChatSession();
// await session.initialize();
// const initial = await session.addImage('url/chart.jpg', 'What does this chart show?');
// const followup = await session.followUp('What are the key trends?');
```

### Image Classification and Structured Tagging

Prompting the model to return structured data (JSON) for easy consumption.

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function classifyImage(imageUrl) {
  const zai = await ZAI.create();

  const prompt = `Analyze this image and provide: 1. Main category 2. Key objects detected 3. Scene description 4. Suggested tags (comma-separated). Format your response strictly as JSON.`;

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ],
    thinking: { type: 'disabled' }
  });

  const content = response.choices[0]?.message?.content;
  
  try {
    return JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse JSON response:", content);
    return { rawResponse: content };
  }
}
```

### OCR and Text Extraction

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function extractText(imageUrl) {
  const zai = await ZAI.create();

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract all text from this image. Preserve the layout and formatting as much as possible.'
          },
          {
            type: 'image_url',
            image_url: { url: imageUrl }
          }
        ]
      }
    ],
    thinking: { type: 'disabled' }
  });

  return response.choices[0]?.message?.content;
}
```

## Best Practices

### 1. Prompt Engineering
- Be specific about required output (e.g., "List", "Compare", "Format as JSON").
- Provide necessary context (e.g., "This is a financial chart", "This is a handwritten receipt").

### 2. Performance and Quality
- Use high-quality images.
- Optimize image size to balance quality and speed.
- Use base64 encoding for reliability and speed when possible.

### 3. Error Handling Example

```javascript
async function safeVisionChat(imageUrl, question) {
  try {
    const zai = await ZAI.create();
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: question },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    });

    return { success: true, content: response.choices[0]?.message?.content };
  } catch (error) {
    console.error('Vision chat error:', error.message);
    return { success: false, error: error.message };
  }
}
```

### 4. Security
- Validate and sanitize all user-provided data (URLs, images).
- Implement rate limiting for public-facing APIs.
- **NEVER** expose SDK credentials in client-side code.

## Integration Example: Express.js API

This example shows how to initialize and cache the SDK instance for high-performance server-side processing.

```javascript
import express from 'express';
import ZAI from 'z-ai-web-dev-sdk';

const app = express();
app.use(express.json());

let zaiInstance;

// Initialize SDK once globally for efficiency
async function initZAI() {
  zaiInstance = await ZAI.create();
  console.log('ZAI SDK Initialized.');
}

app.post('/api/analyze-image', async (req, res) => {
  if (!zaiInstance) {
    return res.status(503).json({ error: 'Server initializing ZAI SDK' });
  }

  try {
    const { imageUrl, question } = req.body;

    if (!imageUrl || !question) {
      return res.status(400).json({ error: 'imageUrl and question are required' });
    }

    const response = await zaiInstance.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: question },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    });

    res.json({
      success: true,
      analysis: response.choices[0]?.message?.content
    });
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error during analysis.' });
  }
});

initZAI().then(() => {
  app.listen(3000, () => {
    console.log('Vision chat API running on port 3000');
  });
}).catch(err => {
  console.error('Failed to initialize ZAI SDK:', err);
  process.exit(1);
});