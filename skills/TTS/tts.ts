import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";

const DEFAULT_VOICE = "tongtong";
const DEFAULT_OUTFILE = "output.wav";

/**
 * Converts text to speech (TTS) and saves the output to a file.
 * @param text The text to synthesize.
 * @param outFile The path to save the resulting audio file.
 */
async function main() {
    const args = process.argv.slice(2);
    
    // Ensure all arguments are treated as the input text if wrapped in quotes, or joined
    const text = args.length > 0 ? args[0] : '';
    const rawOutFile = args[1] || DEFAULT_OUTFILE;

    if (!text) {
        console.error('ERROR: Text input required.');
        console.log(`Usage: node tts.js "Your text here" [optional/output/path.wav]`);
        return;
    }

    const absoluteOutFile = path.resolve(rawOutFile);


  try {
    console.log(`Initializing ZAI SDK for TTS generation.`);
    const zai = await ZAI.create();

    console.log(`Synthesizing text: "${text.substring(0, 50)}..."`);
    
    const response = await zai.audio.tts.create({
      input: text,
      voice: DEFAULT_VOICE,
      speed: 1.0,
      response_format: "wav",
      stream: false,
    });

    // Ensure response is valid before processing
    if (!response || !response.arrayBuffer) {
        throw new Error("Invalid or empty response received from TTS API. Check input and API key.");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));
    
    fs.writeFileSync(absoluteOutFile, buffer);
    // FIX: Corrected mangled UTF-8 characters
    console.log(`\n✅ TTS audio successfully saved to ${absoluteOutFile}`);
  } catch (err: any) {
    console.error("\nFATAL TTS FAILURE:");
    if (err instanceof Error) {
        console.error(`Message: ${err.message}`);
        console.error(`Stack: ${err.stack}`);
    } else {
        console.error(err);
    }
  }
}

// Execute the main function
main();