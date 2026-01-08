import ZAI from "z-ai-web-dev-sdk";

async function main() {
    const prompt = process.argv.slice(2).join(' ').trim();
    if (!prompt) {
        console.error('ERROR: Prompt required. Usage: node chat.js "Query"');
        return;
    }

    try {
        console.log(`> ${prompt}`);
        
        // Optimization: Initialize client first to avoid nested await structure
        const client = await ZAI.create();

        const response = await client.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "glm-4-flash", 
            stream: false,
            thinking: { type: "disabled" },
        });

        const reply = response.choices?.[0]?.message?.content?.trim();
        
        console.log("\n--- REPLY ---");
        
        if (reply) {
            console.log(reply);
        } else {
            console.error('ERROR: Empty response.');
            // Keeping verbose logging for API debugging
            console.error(JSON.stringify(response, null, 2));
        }
    } catch (err) {
        // Optimization: Use safer instanceof check for error messaging
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("\nFATAL ERROR:", errorMessage);
    }
}

main();