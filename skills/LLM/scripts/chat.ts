import ZAI, { ChatMessage } from "z-ai-web-dev-sdk";

/**
 * Executes a simple chat completion using the provided prompt.
 * @param prompt The user's query.
 */
async function main() {
    // Robustly handle multi-word prompts
    const prompt = process.argv.slice(2).join(' ').trim();

    if (!prompt) {
        console.error('ERROR: Prompt required.');
        console.log('Usage: node chat.js "What is the capital of France?"');
        return;
    }

  try {
    const zai = await ZAI.create();

    const messages: ChatMessage[] = [
      {
        role: "user",
        content: prompt,
      },
    ];

    console.log(`Sending prompt: "${prompt}"`);

    const response = await zai.chat.completions.create({
      messages,
      model: "glm-4-flash", 
      stream: false,
      thinking: { type: "disabled" },
    });

    const reply = response.choices?.[0]?.message?.content?.trim();
    
    console.log("\n--- Chat Reply ---");
    
    if (reply) {
        console.log(reply);
    } else {
        console.log('No reply content received.');
        console.log('Full API response (for debugging):');
        console.log(JSON.stringify(response, null, 2));
    }
    
  } catch (err: any) {
    console.error("\nFATAL Chat Failure:");
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