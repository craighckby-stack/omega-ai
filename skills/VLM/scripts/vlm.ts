import ZAI, { VisionMessage } from 'z-ai-web-dev-sdk';

/**
 * Executes a Vision Language Model (VLM) chat completion with an image URL.
 * @param imageUrl The URL of the image/video/file.
 * @param prompt The question about the image.
 */
async function main() {
    const imageUrl = process.argv[2];
    const prompt = process.argv.slice(3).join(' ');

    if (!imageUrl || !prompt) {
        console.error('ERROR: Both image URL and prompt are required.');
        console.log('Usage: node vlm.js <image_url> "Your prompt here"');
        return;
    }

	try {
		console.log(`Initializing ZAI SDK for VLM query.`);
		const zai = await ZAI.create();

		const messages: VisionMessage[] = [
            // System instruction for clean output
            {
                role: 'assistant',
                content: [
                    { type: 'text', text: 'Output only text, no markdown. Be concise.' }
                ]
            },
			// User query containing text and image URL
			{
				role: 'user',
				content: [
					{ type: 'text', text: prompt },
					{ type: 'image_url', image_url: { url: imageUrl } }
				]
			}
		];

		const response = await zai.chat.completions.createVision({
            model: 'glm-4.6v', // Recommended model for VLM tasks
			messages,
			thinking: { type: 'disabled' }
		});

		const reply = response.choices?.[0]?.message?.content;
		console.log('\n--- Vision Model Reply ---');
		console.log(reply ?? 'No reply content received.');

        if (reply === undefined) {
            console.log('Full API response:');
            console.log(JSON.stringify(response, null, 2));
        }

	} catch (err: any) {
		console.error('\nFATAL Vision Chat Failure:', err?.message || err);
	}
}

// Execute the main function
main();