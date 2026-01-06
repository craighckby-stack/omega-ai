import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

/**
 * Performs Automatic Speech Recognition (ASR) on a local audio file.
 * @param inputFile The path to the input audio file (e.g., .wav, .mp3).
 */
async function main() {
    // Use path.join to robustly handle arguments that might contain spaces or special characters
    const inputPathSegment = process.argv.slice(2).join(' ');
    
    if (!inputPathSegment) {
        console.error('ERROR: Input audio file path required.');
        console.log('Usage: node asr.js <path/to/audio.wav>');
        return;
    }

    const absoluteInputPath = path.resolve(inputPathSegment);

	if (!fs.existsSync(absoluteInputPath)) {
		console.error(`ERROR: Audio file not found: ${absoluteInputPath}`);
        return;
	}

	try {
        console.log(`Initializing ZAI SDK and reading file: ${absoluteInputPath}`);
		
        // Initialize SDK
        const zai = await ZAI.create();

		const audioBuffer = fs.readFileSync(absoluteInputPath);
		// Convert audio buffer to base64 string for API submission
		const file_base64 = audioBuffer.toString('base64');

        console.log(`Submitting audio file for ASR...`);

		const result = await zai.audio.asr.create({ 
            file_base64,
            // Ensure necessary parameters are set, though default model usually handles ASR
            model: 'glm-4-flash' // Using a fast, modern model
        });

		console.log('\n--- ASR Transcription Result ---');
		const transcription = result.text?.trim();

        if (transcription) {
            console.log(transcription);
        } else {
             console.log('No transcription text received.');
             console.log('Full API response (for debugging):');
             console.log(JSON.stringify(result, null, 2));
        }

	} catch (err: any) {
		console.error('\nFATAL ASR FAILURE:');
        // Provide detailed error output
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