name: ASR
description: Implement speech-to-text (ASR/automatic speech recognition) capabilities using the z-ai-web-dev-sdk. Use this skill when the user needs to transcribe audio files, convert speech to text, build voice input features, or process audio recordings. Supports base64 encoded audio files and returns accurate text transcriptions.
license: MIT
---

# ASR (Speech to Text) Skill

This skill documents the implementation of Speech-to-Text (ASR) functionality using the `z-ai-web-dev-sdk` for accurate audio transcription.

## Skill Location

**Path**: `{project_path}/skills/ASR`

Reference scripts for testing are available in the `{Skill Location}/scripts/` directory (e.g., `{Skill Location}/scripts/asr.ts`).

## Overview

ASR (Automatic Speech Recognition) converts spoken language within audio files into written text, facilitating voice interfaces, transcription services, and audio content analysis.

**IMPORTANT**: The `z-ai-web-dev-sdk` MUST be used exclusively in backend code.

## Prerequisites

The `z-ai-web-dev-sdk` package is assumed to be installed and ready for import.

## CLI Usage (Quick Transcription)

For simple, one-off, or batch transcription tasks, the `z-ai` CLI provides a faster alternative to writing custom code.

### Basic Transcription

```bash
# Transcribe an audio file and print to console
z-ai asr --file ./audio.wav

# Transcribe and save output to JSON
z-ai asr -f ./recording.mp3 -o transcript.json
```

### Base64 Transcription

```bash
# Transcribe from a base64 encoded audio string
z-ai asr --base64 "UklGRiQAAABXQVZFZm10..." -o result.json
```

### Streaming Output

```bash
# Stream partial transcription results as they are recognized
z-ai asr -f ./long_audio.wav --stream
```

### CLI Parameters

- `--file, -f <path>`: Input audio file path.
- `--base64, -b <base64>`: Base64 encoded audio data.
- `--output, -o <path>`: Optional path to save the transcription (JSON format).
- `--stream`: Optional flag to enable streaming transcription output.

## Basic SDK Implementation

The SDK handles audio transcription by receiving the audio file encoded in Base64 format.

### Simple Audio Transcription

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function transcribeAudio(audioFilePath) {
  const zai = await ZAI.create();

  const audioBuffer = fs.readFileSync(audioFilePath);
  const base64Audio = audioBuffer.toString('base64');

  const response = await zai.audio.asr.create({
    file_base64: base64Audio
  });

  return response.text;
}

// Usage Example
// const transcription = await transcribeAudio('./audio.wav');
// console.log('Transcription:', transcription);
```

### Transcribe Multiple Audio Files (Batch Processing)

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function transcribeBatch(audioFilePaths) {
  const zai = await ZAI.create();
  const results = [];

  for (const filePath of audioFilePaths) {
    try {
      const audioBuffer = fs.readFileSync(filePath);
      const base64Audio = audioBuffer.toString('base64');

      const response = await zai.audio.asr.create({
        file_base64: base64Audio
      });

      results.push({
        file: filePath,
        success: true,
        transcription: response.text
      });
    } catch (error) {
      results.push({
        file: filePath,
        success: false,
        error: error.message
      });
    }
  }
  return results;
}

// Usage Example
// const files = ['./1.wav', './2.mp3'];
// const transcriptions = await transcribeBatch(files);
// transcriptions.forEach(result => console.log(`${result.file}: ${result.success ? result.transcription : result.error}`));
```

## Advanced Use Cases

### Audio File Processing with Metadata

This example extracts transcription, file details, and processing metrics.

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function transcribeWithMetadata(audioFilePath) {
  const zai = await ZAI.create();

  const stats = fs.statSync(audioFilePath);
  const audioBuffer = fs.readFileSync(audioFilePath);
  const base64Audio = audioBuffer.toString('base64');

  const startTime = Date.now();

  const response = await zai.audio.asr.create({
    file_base64: base64Audio
  });

  const endTime = Date.now();
  const text = response.text || '';

  return {
    filename: path.basename(audioFilePath),
    fileSize: stats.size,
    transcription: text,
    wordCount: text.split(/\s+/).filter(Boolean).length,
    processingTimeMs: endTime - startTime,
    timestamp: new Date().toISOString()
  };
}
```

### Real-time Audio Processing Service with Caching

Using a class structure to initialize the SDK once and implement caching for repeated requests.

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import crypto from 'crypto';

class ASRService {
  constructor() {
    this.zai = null;
    this.transcriptionCache = new Map();
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  generateCacheKey(audioBuffer) {
    return crypto.createHash('md5').update(audioBuffer).digest('hex');
  }

  async transcribe(audioFilePath, useCache = true) {
    const audioBuffer = fs.readFileSync(audioFilePath);
    const cacheKey = this.generateCacheKey(audioBuffer);

    if (useCache && this.transcriptionCache.has(cacheKey)) {
      return { transcription: this.transcriptionCache.get(cacheKey), cached: true };
    }

    const base64Audio = audioBuffer.toString('base64');

    const response = await this.zai.audio.asr.create({
      file_base64: base64Audio
    });
    
    const transcription = response.text;

    if (useCache) {
      this.transcriptionCache.set(cacheKey, transcription);
    }

    return { transcription, cached: false };
  }
}

// Usage
// const asrService = new ASRService();
// await asrService.initialize();
// const result1 = await asrService.transcribe('./audio.wav');
```

### Directory Transcription and Result Aggregation

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

async function transcribeDirectory(directoryPath, outputJsonPath) {
  const zai = await ZAI.create();

  const supportedFormats = /\.(wav|mp3|m4a|flac|ogg)$/i;
  const files = fs.readdirSync(directoryPath);
  const audioFiles = files.filter(file => supportedFormats.test(file));

  const results = {
    directory: directoryPath,
    totalFiles: audioFiles.length,
    processedAt: new Date().toISOString(),
    transcriptions: []
  };

  for (const filename of audioFiles) {
    const filePath = path.join(directoryPath, filename);

    try {
      const audioBuffer = fs.readFileSync(filePath);
      const base64Audio = audioBuffer.toString('base64');

      const response = await zai.audio.asr.create({
        file_base64: base64Audio
      });
      
      const text = response.text || '';

      results.transcriptions.push({
        filename: filename,
        success: true,
        text: text,
        wordCount: text.split(/\s+/).filter(Boolean).length
      });

      console.log(`[OK] Transcribed: ${filename}`);
    } catch (error) {
      results.transcriptions.push({
        filename: filename,
        success: false,
        error: error.message
      });

      console.error(`[FAIL] Failed: ${filename} - ${error.message}`);
    }
  }

  fs.writeFileSync(outputJsonPath, JSON.stringify(results, null, 2));
  return results;
}
```

## Best Practices

### 1. Robust Error Handling and Pre-checks

Implement checks for file existence and size limits before sending data to the API.

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

async function safeTranscribe(audioFilePath) {
  try {
    if (!fs.existsSync(audioFilePath)) {
      throw new Error(`File not found: ${audioFilePath}`);
    }

    // Check file size (e.g., limit to 100MB)
    const stats = fs.statSync(audioFilePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    if (fileSizeMB > 100) {
      throw new Error(`File too large: ${fileSizeMB.toFixed(2)}MB (max 100MB)`);
    }

    const zai = await ZAI.create();
    const audioBuffer = fs.readFileSync(audioFilePath);
    const base64Audio = audioBuffer.toString('base64');

    const response = await zai.audio.asr.create({
      file_base64: base64Audio
    });
    
    if (!response.text || response.text.trim().length === 0) {
      throw new Error('Empty transcription result');
    }

    return { success: true, transcription: response.text, filePath: audioFilePath };
  } catch (error) {
    console.error(`Transcription failed for ${audioFilePath}:`, error.message);
    return { success: false, error: error.message, filePath: audioFilePath };
  }
}
```

### 2. Post-Processing Transcriptions

Cleaning up raw ASR output improves readability and usability.

```javascript
function cleanTranscription(text) {
  if (!text) return '';
  
  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Capitalize first letter of sentences
  text = text.replace(/(^\w|[.!?]\s*\w)/g, match => match.toUpperCase());

  // Simple removal of common filler words (optional)
  const fillers = ['um', 'uh', 'ah', 'like', 'you know', 'gonna', 'kinda'];
  const fillerPattern = new RegExp(`\\b(${fillers.join('|')})\\b`, 'gi');
  text = text.replace(fillerPattern, '').replace(/\s+/g, ' ');

  return text.trim();
}
```

## Integration Example: Express API

Example of handling file uploads via an HTTP endpoint and performing transcription.

```javascript
import express from 'express';
import multer from 'multer';
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const app = express();
// Use memory storage to avoid writing large files to disk unnecessarily,
// or use disk storage and ensure proper cleanup.
const upload = multer({ dest: 'uploads/' }); 

let zaiInstance;

async function initZAI() {
  zaiInstance = await ZAI.create();
}

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided' });
  }

  const filePath = req.file.path;
  
  try {
    const audioBuffer = fs.readFileSync(filePath);
    const base64Audio = audioBuffer.toString('base64');

    const response = await zaiInstance.audio.asr.create({
      file_base64: base64Audio
    });

    const transcription = response.text;

    res.json({
      success: true,
      transcription: transcription,
      wordCount: transcription.split(/\s+/).filter(Boolean).length
    });
  } catch (error) {
    console.error('Transcription API Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    // Crucial: Clean up the temporary file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

initZAI().then(() => {
  app.listen(3000, () => {
    console.log('ASR API running on port 3000');
  });
});
```

## Performance Tips

1. **SDK Initialization**: Create the `ZAI` instance once and reuse it globally (as shown in `ASRService` and Express examples).
2. **Caching**: Utilize a caching layer (e.g., in-memory or Redis) for frequently requested audio files.
3. **File Optimization**: Ensure input audio files are appropriately sampled (16kHz recommended) and compressed where quality loss is acceptable.
4. **Asynchronous Operations**: Use `Promise.all` for parallel processing of independent files in batch jobs.

## Troubleshooting

| Issue | Solution |
| :--- | :--- |
| SDK usage in frontend | Ensure `z-ai-web-dev-sdk` is imported only in server-side/backend code. |
| Empty or poor transcription | Verify audio quality (clear speech, minimal noise) and file format compatibility. |
| Large file processing failure | Split audio files into segments or increase memory allocation for the processing environment. |
| Slow performance | Implement caching and reuse the SDK instance. Check network latency. |