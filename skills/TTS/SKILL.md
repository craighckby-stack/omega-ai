name: TTS
description: Implement text-to-speech (TTS) capabilities using the z-ai-web-dev-sdk. Use this skill when the user needs to convert text into natural-sounding speech, create audio content, build voice-enabled applications, or generate spoken audio files. Supports multiple voices, adjustable speed, and various audio formats.
license: MIT
---

# TTS (Text to Speech) Skill

This skill guides the implementation of text-to-speech (TTS) functionality using the `z-ai-web-dev-sdk` package, enabling conversion of text into natural-sounding speech audio.

## Skill Path

**Skill Location**: `{project_path}/skills/TTS`

**Reference Scripts**: Example test scripts are available in the `{Skill Location}/scripts/` directory (e.g., `{Skill Location}/scripts/tts.ts`).

## Overview

Text-to-Speech allows you to generate spoken audio from text input, supporting various voices, speeds, and output formats for diverse applications.

**IMPORTANT**: `z-ai-web-dev-sdk` MUST be used in backend code only. Never use it in client-side code.

## API Constraints and Parameters

| Parameter | Constraint / Range | Default | Notes |
| :--- | :--- | :--- | :--- |
| **Input Text** | Maximum 1024 characters | N/A | Longer text must be split into chunks. |
| **Speed** | 0.5 (slowest) to 2.0 (fastest) | 1.0 | Values outside this range cause errors. |
| **Volume** | > 0 (exclusive) up to 10 (inclusive) | 1.0 | Optional parameter. |
| **Format (Non-Streaming)**| `wav`, `mp3`, `pcm` | `wav` | Use `stream: false`. |
| **Format (Streaming)** | Only `pcm` is supported | N/A | Requires `stream: true`. |
| **Sample Rate** | 24000 Hz | 24000 Hz | Recommended output rate. |

### Best Practice: Handling Long Text

Since the input text is limited to 1024 characters, use the following utility function to segment longer content by sentences:

```javascript
/**
 * Splits text into chunks based on sentence boundaries, respecting a maximum length.
 * @param {string} text - The input text.
 * @param {number} maxLength - The maximum length for each chunk (default 1000).
 * @returns {string[]} An array of text chunks.
 */
function splitTextIntoChunks(text, maxLength = 1000) {
  const chunks = [];
  // Splits text by common sentence terminators (., !, ?)
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = '';
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  
  return chunks;
}
```

## Prerequisites

The `z-ai-web-dev-sdk` package is assumed to be installed and ready for use.

## CLI Usage (For Simple Tasks)

For quick audio generation, testing voices, or simple automation, the z-ai CLI is recommended.

### Basic TTS Example

```bash
# Convert text to speech (default WAV format)
z-ai tts --input "Hello, world" --output ./hello.wav
```

### Advanced Options

```bash
# Use specific voice and speed
z-ai tts -i "Welcome to our service" -o ./welcome.wav --voice tongtong --speed 1.5

# Generate MP3 output
z-ai tts -i "Hello World" -o ./hello.mp3 --format mp3

# Enable streaming output (must be PCM format if streaming)
z-ai tts -i "This is a longer text that will be streamed" -o ./stream.pcm --stream
```

### CLI Parameters Summary

| Option | Shorthand | Description | Constraint |
| :--- | :--- | :--- | :--- |
| `--input` | `-i` | Text to convert (Required) | Max 1024 chars |
| `--output` | `-o` | Output audio file path (Required) | N/A |
| `--voice` | `-v` | Voice type (Optional) | Default: `tongtong` |
| `--speed` | `-s` | Speech speed | Range: 0.5 to 2.0 |
| `--format` | `-f` | Output format | `wav`, `mp3`, `pcm` (Default: `wav`) |
| `--stream` | | Enable streaming output | Requires `pcm` format |

## SDK Implementation

All examples require Node.js environment imports (`fs`, `path`).

### 1. Basic TTS Generation

This function converts text to audio and saves it to a file.

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

/**
 * Generates audio from text and saves it locally.
 * @param {string} text - The text to synthesize.
 * @param {string} outputPath - Path to save the resulting audio file.
 * @returns {Promise<string>} The path of the saved file.
 */
async function textToSpeech(text, outputPath) {
  const zai = await ZAI.create();

  const response = await zai.audio.tts.create({
    input: text,
    voice: 'tongtong',
    speed: 1.0,
    response_format: 'wav',
    stream: false
  });

  // Handle Response object: Get ArrayBuffer and convert to Node Buffer
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));

  fs.writeFileSync(outputPath, buffer);
  console.log(`Audio saved to ${outputPath}`);
  return outputPath;
}

// Usage
// await textToSpeech('Hello, world!', './output.wav');
```

### 2. Adjustable Parameters (Voice, Speed, Volume)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function generateWithOptions(text, options, outputPath) {
  const zai = await ZAI.create();
  
  const defaults = {
    voice: 'tongtong',
    speed: 1.0, // Range [0.5, 2.0]
    volume: 1.0, // Range (0, 10]
    format: 'wav',
    stream: false
  };
  const params = { ...defaults, ...options };

  const response = await zai.audio.tts.create({
    input: text,
    voice: params.voice, 
    speed: params.speed,
    volume: params.volume,
    response_format: params.format,
    stream: params.stream
  });

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(new Uint8Array(arrayBuffer));

  fs.writeFileSync(outputPath, buffer);
  return outputPath;
}

// Usage examples
// await generateWithOptions('Slower narration.', { speed: 0.8 }, './slow.wav');
// await generateWithOptions('Louder message.', { volume: 5.0 }, './loud.wav');
// await generateWithOptions('MP3 output test.', { format: 'mp3' }, './mp3_test.mp3');
```

### 3. Batch Processing

This example iterates over an array of texts, generating and saving audio for each chunk.

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function batchTextToSpeech(textArray, outputDir) {
  // Use instance reuse pattern (see Best Practices)
  const zai = await ZAI.create(); 
  const results = [];

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (let i = 0; i < textArray.length; i++) {
    const text = textArray[i];
    const outputPath = path.join(outputDir, `audio_${i + 1}.wav`);

    try {
      const response = await zai.audio.tts.create({
        input: text,
        voice: 'tongtong',
        speed: 1.0,
        response_format: 'wav',
        stream: false
      });

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(new Uint8Array(arrayBuffer));

      fs.writeFileSync(outputPath, buffer);
      results.push({ success: true, text, path: outputPath });

    } catch (error) {
      results.push({ success: false, text, error: error.message });
    }
  }
  return results;
}

/*
// Usage
const texts = ['Part one', 'Part two', 'Part three'];
const results = await batchTextToSpeech(texts, './audio-output');
*/
```

## Integration Example: Next.js API Route

This example shows how to serve the generated audio buffer directly through a serverless function.

```javascript
import { NextRequest, NextResponse } from 'next/server';
// Ensure ZAI is imported dynamically or only used on the server side
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(req: NextRequest) {
  try {
    // Note: Always validate and sanitize input parameters
    const { text, voice = 'tongtong', speed = 1.0 } = await req.json();

    if (!text || text.trim().length === 0 || text.length > 1024) {
      return NextResponse.json(
        { error: 'Invalid or missing text input (max 1024 chars)' },
        { status: 400 }
      );
    }
    
    // Create SDK instance (consider reusing instance for better performance)
    const zai = await ZAI.create();

    // Generate TTS audio (using wav for client playback convenience)
    const response = await zai.audio.tts.create({
      input: text.trim(),
      voice: voice,
      speed: speed,
      response_format: 'wav',
      stream: false,
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    // Return audio buffer as response
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache', // Prevent aggressive caching of dynamic content
      },
    });
  } catch (error) {
    console.error('TTS API Error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error 
          ? error.message 
          : 'Audio generation failed. Please try again.',
      },
      { status: 500 }
    );
  }
}
```

## Best Practices and Performance

### 1. SDK Instance Reuse

Creating the SDK instance is resource-intensive. Reuse a singleton instance across multiple requests for optimal performance.

```javascript
import ZAI from 'z-ai-web-dev-sdk';

let zaiInstance = null;

async function getZAIInstance() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

// Usage: 
// const zai = await getZAIInstance();
// const response = await zai.audio.tts.create({ ... });
```

### 2. Text Preparation and Cleaning

Improve pronunciation accuracy by cleaning and normalizing input text.

```javascript
/**
 * Cleans text for better TTS pronunciation.
 */
function prepareTextForTTS(text) {
  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Expand common abbreviations (example set)
  const abbreviations = {
    'Dr.': 'Doctor',
    'Mr.': 'Mister',
    'Mrs.': 'Misses',
    'etc.': 'et cetera'
  };

  for (const [abbr, full] of Object.entries(abbreviations)) {
    text = text.replace(new RegExp(abbr, 'g'), full);
  }

  return text;
}
```

### 3. Robust Error Handling

Validate constraints locally before hitting the API, and wrap API calls in try/catch blocks.

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function safeTTS(text, outputPath) {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Text input cannot be empty');
    }
    if (text.length > 1024) {
      throw new Error('Text input exceeds maximum length of 1024 characters');
    }

    const zai = await getZAIInstance(); // Assume instance reuse utility is implemented

    const response = await zai.audio.tts.create({
      input: text,
      voice: 'tongtong',
      speed: 1.0,
      response_format: 'wav',
      stream: false
    });

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    fs.writeFileSync(outputPath, buffer);

    return { success: true, path: outputPath, size: buffer.length };

  } catch (error) {
    console.error('TTS Error:', error.message);
    return { success: false, error: error.message };
  }
}
```

## Reference Information

### Handling the Response Object

The `zai.audio.tts.create()` method returns a standard Web `Response` object. **Do not** attempt to access a property named `audio` directly.

```javascript
// ✅ CORRECT APPROACH
const response = await zai.audio.tts.create({ ... });
const arrayBuffer = await response.arrayBuffer();
const buffer = Buffer.from(new Uint8Array(arrayBuffer));

// ❌ INCORRECT APPROACH
// const buffer = Buffer.from(response.audio); 
```

### Available Voices

| Voice Name | Usage |
| :--- | :--- |
| `tongtong` | Default voice |
| `chuichui` | |
| `xiaochen` | |
| `jam` | |
| `kazi` | |
| `douji` | |
| `luodo` | |

### Troubleshooting Checklist

| Issue | Solution |
| :--- | :--- |
| Text exceeds 1024 chars | Split text into smaller chunks (`splitTextIntoChunks`). |
| Invalid Speed/Volume | Ensure speed is in [0.5, 2.0] and volume is in (0, 10]. |
| Streaming Fails with WAV/MP3 | Streaming only supports `pcm` format. Set `stream: false` for `wav` or `mp3`. |
| Audio is corrupted/empty | Check Buffer conversion: `Buffer.from(new Uint8Array(await response.arrayBuffer()))`. |
| `SDK must be used in backend` | Verify the SDK import is not executed in client-side code (e.g., inside browser components). |
| Slow performance | Reuse the SDK instance (singleton pattern). |