import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const DEFAULT_VOICE = "tongtong";
const DEFAULT_OUTFILE = "output.wav";
const MAX_TEXT_PREVIEW = 50;

async function main() {
    const [rawText, rawOutFile] = process.argv.slice(2);
    
    // Use optional chaining for safe trimming
    const text = rawText?.trim() || ''; 
    const absoluteOutFile = path.resolve(rawOutFile || DEFAULT_OUTFILE);

    if (!text) {
        console.error(`ERROR: Text input required.\nUsage: node tts.js "Your text here" [optional/output/path.wav]`);
        process.exit(1);
    }

    const previewText = text.length > MAX_TEXT_PREVIEW
        ? `${text.substring(0, MAX_TEXT_PREVIEW)}...`
        : text;

    try {
        console.log(`Initializing ZAI SDK...`);
        const zai = await ZAI.create();

        console.log(`Synthesizing text: "${previewText}"`);
        
        const response = await zai.audio.tts.create({
            input: text,
            voice: DEFAULT_VOICE,
            speed: 1.0,
            response_format: "wav",
        });

        // Defensive check: Ensure the response is usable (like a Fetch Response object)
        if (!response || typeof response.arrayBuffer !== 'function') {
            throw new Error("Invalid or unexpected response structure received from TTS API.");
        }

        const arrayBuffer = await response.arrayBuffer();
        
        // Convert ArrayBuffer directly to Node.js Buffer for writing
        const buffer = Buffer.from(arrayBuffer); 
        
        fs.writeFileSync(absoluteOutFile, buffer);
        
        console.log(`\n[SUCCESS] Audio saved: ${absoluteOutFile}`);
    } catch (err) {
        console.error("\nFATAL TTS FAILURE:");
        if (err instanceof Error) {
            console.error(`Error: ${err.message}`);
        } else {
            console.error(`Unknown error: ${String(err)}`);
        }
        process.exit(1);
    }
}

main();