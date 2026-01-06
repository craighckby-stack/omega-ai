import ZAI, { ChatMessage } from "z-ai-web-dev-sdk";

/**
 * Executes a simple chat completion using the provided prompt.
 * @param prompt The user's query.
 */
async function main() {
    const prompt = process.argv.slice(2).join(' ');

    if (!prompt) {
        console.error('ERROR: Prompt required.');
        console.log('Usage: node chat.js "What is the capital of France?"');
        return;
    }

  try {
    const zai = await ZAI.create();

    // Start with the user's input directly. Removed unnecessary 'assistant' priming message.
    const messages: ChatMessage[] = [
      {
        role: "user",
        content: prompt,
      },
    ];

    console.log(`Sending prompt: "${prompt}"`);

    const response = await zai.chat.completions.create({
      messages,
      // Use a consistent model if not specified
      model: "glm-4-flash", 
      stream: false,
      thinking: { type: "disabled" },
    });

    const reply = response.choices?.[0]?.message?.content;
    console.log("\n--- Chat Reply ---");
    console.log(reply ?? 'No reply content received.');

    if (reply === undefined) {
        console.log('Full API response:');
        console.log(JSON.stringify(response, null, 2));
    }
    
  } catch (err: any) {
    console.error("\nFATAL Chat Failure:", err?.message || err);
  }
}

// Execute the main function
main();