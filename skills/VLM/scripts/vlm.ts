import ZAI, { VisionMessage } from 'z-ai-web-dev-sdk';

/**
 * Executes a Vision Language Model (VLM) chat completion with an image URL.
 * @param imageUrl The URL of the image/video/file.
 * @param prompt The question about the image.
 */
async function main() {
    const imageUrl = process.argv[2];
    // Robustly join remaining arguments as the prompt
    const prompt = process.argv.slice(3).join(' ').trim();

    if (!imageUrl || !prompt) {
        console.error('ERROR: Both image URL and prompt are required.');
        console.log('Usage: node vlm.js <image_url> "Your prompt here"');
        return;
    }

	try {
		console.log(`Initializing ZAI SDK for VLM query.`);
		const zai = await ZAI.create();

        // DALEK KHAN MANDATE: Move instructional text into the user prompt 
        // to ensure it is processed correctly by the model, eliminating the ambiguous 'assistant' pre-prompt.
        const systemInstruction = 'Output only text, no markdown. Be concise. Analyze the provided image/video content.';
        const combinedPrompt = `${systemInstruction} QUERY: ${prompt}`;

		const messages: VisionMessage[] = [
			// User query containing instruction, text, and image URL
			{
				role: 'user',
				content: [
					{ type: 'text', text: combinedPrompt },
					{ type: 'image_url', image_url: { url: imageUrl } }
				]
			}
		];

		const response = await zai.chat.completions.createVision({
            model: 'glm-4.6v', // Recommended model for VLM tasks
			messages,
			thinking: { type: 'disabled' }
		});

		const reply = response.choices?.[0]?.message?.content?.trim();
		console.log('\n--- Vision Model Reply ---');

        if (reply) {
		    console.log(reply);
        } else {
            console.log('No reply content received.');
            console.log('Full API response (for debugging):');
            console.log(JSON.stringify(response, null, 2));
        }

	} catch (err: any) {
		console.error('\nFATAL Vision Chat Failure:');
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