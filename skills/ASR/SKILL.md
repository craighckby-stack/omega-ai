name: ASR
description: Implement speech-to-text (ASR/automatic speech recognition) capabilities using the z-ai-web-dev-sdk. Use this skill when the user needs to transcribe audio files, convert speech to text, build voice input features, or process audio recordings. Supports base64 encoded audio files and returns accurate text transcriptions.
license: MIT
---

# ASR (Speech to Text) Skill

This skill documents the implementation of Speech-to-Text (ASR) functionality using the `z-ai-web-dev-sdk` for accurate audio transcription.

## Skill Location

**Path**: `{project_path}/skills/ASR`

Reference scripts for testing are available in the `{Skill Location}/scripts/` directory.

## Overview

ASR (Automatic Speech Recognition) converts spoken language within audio files into written text, facilitating voice interfaces, transcription services, and audio content analysis.

**IMPORTANT**: The `z-ai-web-dev-sdk` MUST be used exclusively in secure backend environments.

## Prerequisites

The `z-ai-web-dev-sdk` package must be installed and initialized.

## CLI Usage (Quick Transcription)

For simple, one-off, or batch transcription tasks, the `z-ai` CLI provides a powerful alternative to writing custom code.

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

The SDK processes audio files after encoding them into Base64 format.

### Simple Audio Transcription

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs/promises'; // Use promises for cleaner async code
import path from 'path';

async function transcribeAudio(audioFilePath) {
  const zai = await ZAI.create();

  // Read file and encode in one step
  const audioBuffer = await fs.readFile(audioFilePath);
  const base64Audio = audioBuffer.toString('base64');

  const response = await zai.audio.asr.create({
    file_base64: base64Audio
  });

  return response.text;
}

// Usage Example
// const transcription = await transcribeAudio(path.join(process.cwd(), 'audio.wav'));
// console.log('Transcription:', transcription);
```

### Transcribe Multiple Audio Files (Parallel Batch Processing)

For efficiency, transcription requests should be run in parallel using `Promise.all`. We use `Promise.allSettled` to ensure all jobs complete regardless of individual failures.

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs/promises';

async function transcribeBatchParallel(audioFilePaths) {
  const zai = await ZAI.create();

  const transcriptionPromises = audioFilePaths.map(async (filePath) => {
    try {
      const audioBuffer = await fs.readFile(filePath);
      const base64Audio = audioBuffer.toString('base64');

      const response = await zai.audio.asr.create({
        file_base64: base64Audio
      });

      return {
        file: filePath,
        status: 'fulfilled',
        transcription: response.text
      };
    } catch (error) {
      return {
        file: filePath,
        status: 'rejected',
        reason: error.message
      };
    }
  });
  
  // Wait for all promises to resolve/reject
  const results = await Promise.allSettled(transcriptionPromises);
  
  // Format results for output
  return results.map(result => {
    if (result.status === 'fulfilled') {
        return result.value;
    } else {
        // Handle rejection structure from the map function
        return result.reason.value; 
    }
  });
}

// Usage Example (assuming files array is defined)
// const transcriptions = await transcribeBatchParallel(['./1.wav', './2.mp3']);
// transcriptions.forEach(result => console.log(result.file, result.status, result.transcription || result.reason));
```

## Advanced Use Cases

### Audio File Processing with Metadata

This example extracts transcription, file details, and processing metrics.

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs/promises';
import path from 'path';

async function transcribeWithMetadata(audioFilePath) {
  const zai = await ZAI.create();

  // Use stat() for asynchronous file stats
  const [stats, audioBuffer] = await Promise.all([
    fs.stat(audioFilePath),
    fs.readFile(audioFilePath)
  ]);
  
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

Using a class structure to initialize the SDK once and implement caching based on audio file hash (content).

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs/promises';
import crypto from 'crypto';

class ASRService {
  /** @type {ZAI | null} */
  zai = null;
  transcriptionCache = new Map();

  async initialize() {
    if (!this.zai) {
      this.zai = await ZAI.create();
    }
  }

  generateCacheKey(audioBuffer) {
    return crypto.createHash('md5').update(audioBuffer).digest('hex');
  }

  async transcribe(audioFilePath, useCache = true) {
    if (!this.zai) throw new Error('ASRService not initialized. Call initialize() first.');
    
    const audioBuffer = await fs.readFile(audioFilePath);
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
import fs from 'fs/promises';
import path from 'path';

async function transcribeDirectory(directoryPath, outputJsonPath) {
  const zai = await ZAI.create();
  const supportedFormats = /\.(wav|mp3|m4a|flac|ogg)$/i;

  const files = await fs.readdir(directoryPath);
  const audioFiles = files.filter(file => supportedFormats.test(file));

  const results = {
    directory: directoryPath,
    totalFiles: audioFiles.length,
    processedAt: new Date().toISOString(),
    transcriptions: []
  };

  const transcriptionPromises = audioFiles.map(async (filename) => {
    const filePath = path.join(directoryPath, filename);

    try {
      const audioBuffer = await fs.readFile(filePath);
      const base64Audio = audioBuffer.toString('base64');

      const response = await zai.audio.asr.create({
        file_base64: base64Audio
      });
      
      const text = response.text || '';
      console.log(`[OK] Transcribed: ${filename}`);

      return {
        filename: filename,
        success: true,
        text: text,
        wordCount: text.split(/\s+/).filter(Boolean).length
      };
    } catch (error) {
      console.error(`[FAIL] Failed: ${filename} - ${error.message}`);
      return {
        filename: filename,
        success: false,
        error: error.message
      };
    }
  });

  const transcriptionResults = await Promise.all(transcriptionPromises);
  results.transcriptions = transcriptionResults;

  await fs.writeFile(outputJsonPath, JSON.stringify(results, null, 2));
  return results;
}
```

## Best Practices

### 1. Robust Error Handling and Pre-checks

Implement checks for file existence and size limits before sending data to the API to avoid unnecessary network transfers or fatal errors.

```javascript
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs/promises';
import fsSync from 'fs'; // Use sync check for quick existence validation

const MAX_FILE_SIZE_MB = 100;

async function safeTranscribe(audioFilePath) {
  try {
    if (!fsSync.existsSync(audioFilePath)) {
      throw new Error(`File not found: ${audioFilePath}`);
    }

    const stats = await fs.stat(audioFilePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      throw new Error(`File too large: ${fileSizeMB.toFixed(2)}MB (max ${MAX_FILE_SIZE_MB}MB)`);
    }

    const zai = await ZAI.create();
    const audioBuffer = await fs.readFile(audioFilePath);
    const base64Audio = audioBuffer.toString('base64');

    const response = await zai.audio.asr.create({
      file_base64: base64Audio
    });
    
    const transcription = response.text;
    
    if (!transcription || transcription.trim().length === 0) {
      throw new Error('Empty transcription result returned by API');
    }

    return { success: true, transcription, filePath: audioFilePath };
  } catch (error) {
    console.error(`Transcription failed for ${audioFilePath}:`, error.message);
    return { success: false, error: error.message, filePath: audioFilePath };
  }
}
```

### 2. Post-Processing Transcriptions

Cleaning up raw ASR output improves readability and usability, often needed when the model doesn't handle punctuation perfectly.

```javascript
function cleanTranscription(text) {
  if (!text) return '';
  
  // 1. Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // 2. Simple sentence capitalization heuristic
  // Capitalize after start or after common ending punctuation (. ! ?)
  text = text.replace(/(^\w|[.!?]\s*\w)/g, match => match.toUpperCase());

  // 3. Remove common filler words (use sparingly, depending on required accuracy)
  const fillers = ['um', 'uh', 'ah', 'like', 'you know'];
  const fillerPattern = new RegExp(`\\b(${fillers.join('|')})\\b`, 'gi');
  text = text.replace(fillerPattern, '').replace(/\s+/g, ' ').trim();

  return text;
}
```

## Integration Example: Express API

Example of handling file uploads via an HTTP endpoint and performing transcription, ensuring resource cleanup.

```javascript
import express from 'express';
import multer from 'multer';
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs'; // Using synchronous fs for critical cleanup

const app = express();
// Configure disk storage for multer
const upload = multer({ dest: 'uploads/' }); 

let zaiInstance;

async function initZAI() {
  // Initialize SDK once globally
  zaiInstance = await ZAI.create();
}

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  if (!zaiInstance) {
      return res.status(503).json({ error: 'Service initializing' });
  }
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

    const transcription = response.text || '';

    res.json({
      success: true,
      transcription: transcription,
      wordCount: transcription.split(/\s+/).filter(Boolean).length
    });
  } catch (error) {
    console.error('Transcription API Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    // CRUCIAL: Clean up the temporary file immediately
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

initZAI().then(() => {
  app.listen(3000, () => {
    console.log('ASR API running on port 3000');
  });
}).catch(err => {
  console.error('Failed to initialize ZAI SDK:', err);
  process.exit(1);
});
```

## Performance Tips

1. **SDK Initialization**: Instantiate `ZAI` once and reuse the instance across requests (e.g., singleton pattern or global scope).
2. **Parallel Processing**: Utilize `Promise.all` or `Promise.allSettled` for batch transcription of independent files.
3. **Caching**: Implement a content-based caching mechanism (using file hash) to avoid re-transcribing identical audio data.
4. **I/O Efficiency**: Use the `fs/promises` module for asynchronous file operations to prevent blocking the Node.js event loop during file reading/writing.

## Troubleshooting

| Issue | Solution |
| :--- | :--- |
| SDK usage in frontend | Ensure `z-ai-web-dev-sdk` is imported only in server-side/backend code. |
| Empty or poor transcription | Verify audio quality (clear speech, minimal background noise) and ensure the correct audio format is being used. |
| Large file processing failure | Check the audio file size limits (100MB typical recommended maximum). Use audio splitting/chunking for very long recordings. |
| Slow performance | Reuse the `ZAI` instance. Check network latency and verify that batch processing is using parallelization (`Promise.all`). |