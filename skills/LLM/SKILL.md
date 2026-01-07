FILE: skills/LLM/SKILL.md
CODE:
---
name: LLM
description: Implement large language model (LLM) chat completions using the z-ai-web-dev-sdk. Use this skill when the user needs to build conversational AI applications, chatbots, AI assistants, or any text generation features. Supports multi-turn conversations, system prompts, and context management.
license: MIT
---

# LLM (Large Language Model) Skill

This skill guides the implementation of chat completions functionality using the `z-ai-web-dev-sdk` package, enabling powerful conversational AI and text generation capabilities.

## Skill Location & Reference

**Skill Location**: `{project_path}/skills/llm`

**Reference Scripts**: Example test scripts are available in the `{Skill Location}/scripts/` directory. See `{Skill Location}/scripts/chat.ts` for a working example.

## Overview

The LLM skill allows you to build applications that leverage large language models for natural language understanding and generation (chatbots, AI assistants, content generation, etc.).

**IMPORTANT**: `z-ai-web-dev-sdk` MUST be used in backend code only. Never use it in client-side code.

## Prerequisites

The `z-ai-web-dev-sdk` package is already installed. Import it as shown in the examples below.

## CLI Usage (For Simple Tasks)

For simple, one-off chat completions, use the `z-ai` CLI instead of writing code. This is ideal for quick tests, simple queries, or automation scripts.

### Basic Chat

```bash
# Simple question
z-ai chat --prompt "What is the capital of France?"

# Save response to file
z-ai chat -p "Explain quantum computing" -o response.json

# Stream the response
z-ai chat -p "Write a short poem" --stream
```

### Context & Reasoning

```bash
# Custom system prompt for specific behavior
z-ai chat \
  --prompt "Review this code: function add(a,b) { return a+b; }" \
  --system "You are an expert code reviewer" \
  -o review.json

# Enable thinking for complex reasoning (Chain of Thought)
z-ai chat \
  --prompt "If a train travels 120km in 2 hours, what's its speed?" \
  --thinking \
  -o solution.json
```

### CLI Parameters

- `--prompt, -p <text>`: **Required** - User message content
- `--system, -s <text>`: Optional - System prompt for custom behavior
- `--thinking, -t`: Optional - Enable chain-of-thought reasoning (default: disabled)
- `--output, -o <path>`: Optional - Output file path (JSON format)
- `--stream`: Optional - Stream the response in real-time

### When to Use CLI vs SDK

| Use CLI For | Use SDK For |
| :--- | :--- |
| Quick one-off questions | Multi-turn conversations with context |
| Simple automation scripts | Custom conversation management |
| Testing prompts | Integration with web applications (API) |
| Single-turn conversations | Complex chat workflows & production apps |

## Basic Chat Completions

### Simple Question and Answer

```javascript
import ZAI from 'z-ai-web-dev-sdk';

// NOTE: For performance, reuse the ZAI instance if possible.
async function askQuestion(question, systemPrompt = 'You are a helpful assistant.') {
  const zai = await ZAI.create();

  const completion = await zai.chat.completions.create({
    messages: [
      // NOTE: Use 'assistant' role for the system/context message
      { role: 'assistant', content: systemPrompt },
      { role: 'user', content: question }
    ],
    // Disable complex reasoning for fast, direct Q&A
    thinking: { type: 'disabled' } 
  });

  return completion.choices[0]?.message?.content;
}

// Usage 1: Simple Q&A
const answer = await askQuestion('What is the capital of France?');
console.log('Answer:', answer);

// Usage 2: Custom System Prompt (Code reviewer)
const codeReview = await askQuestion(
  'Review this function: function add(a, b) { return a + b; }',
  'You are an expert code reviewer. Analyze code for bugs, performance issues, and best practices.'
);
console.log('Code Review:', codeReview);
```

## Multi-turn Conversations

### Conversation History Management Class

This class manages the conversation state, ensuring context is passed in every request.

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class ConversationManager {
  constructor(systemPrompt = 'You are a helpful assistant.') {
    this.systemPrompt = systemPrompt;
    this.messages = [];
    this.zai = null;
    this.clearHistory(systemPrompt); // Initialize history
  }

  async initialize() {
    this.zai = await ZAI.create(); // Initialize SDK instance once
  }

  async sendMessage(userMessage) {
    if (!this.zai) throw new Error('ConversationManager not initialized. Call initialize() first.');
    
    // Add user message to history
    this.messages.push({
      role: 'user',
      content: userMessage
    });

    // Get completion
    const completion = await this.zai.chat.completions.create({
      messages: this.messages,
      thinking: { type: 'disabled' }
    });

    const assistantResponse = completion.choices[0]?.message?.content;

    // Add assistant response to history
    this.messages.push({
      role: 'assistant',
      content: assistantResponse
    });

    return assistantResponse;
  }

  getHistory() {
    // Exclude the initial system prompt from the count
    return this.messages.slice(1); 
  }

  clearHistory(systemPrompt = this.systemPrompt) {
    this.messages = [
      {
        role: 'assistant',
        content: systemPrompt
      }
    ];
  }

  getMessageCount() {
    // Subtract 1 for the persistent system message
    return this.messages.length - 1;
  }
}

// Usage
const conversation = new ConversationManager();
await conversation.initialize();

const response1 = await conversation.sendMessage('Hi, my name is John.');
console.log('AI:', response1);

const response2 = await conversation.sendMessage('What is my name?');
console.log('AI:', response2); // AI should remember the name
console.log('Total messages:', conversation.getMessageCount());
```

## Advanced Use Cases

### Content Generation Utility

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class ContentGenerator {
  constructor() {
    this.zai = null;
  }

  async initialize() {
    this.zai = await ZAI.create();
  }
  
  async generate(task, systemRole, userPrompt) {
    if (!this.zai) throw new Error('Generator not initialized.');

    const completion = await this.zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemRole },
        { role: 'user', content: userPrompt }
      ],
      thinking: { type: 'disabled' }
    });
    return completion.choices[0]?.message?.content;
  }

  async generateBlogPost(topic, tone = 'professional') {
    return this.generate(
      'Blog Post',
      `You are a professional content writer. Write in a ${tone} tone.`,
      `Write a detailed blog post about: ${topic}. Include an introduction, main points, and conclusion.`
    );
  }

  async generateProductDescription(productName, features) {
    return this.generate(
      'Product Description',
      'You are an expert at writing compelling product descriptions for e-commerce.',
      `Write a product description for "${productName}". Key features: ${features.join(', ')}.`
    );
  }
}

// Usage
const generator = new ContentGenerator();
await generator.initialize();

const blogPost = await generator.generateBlogPost(
  'The Future of Artificial Intelligence',
  'informative'
);
console.log('Blog Post:', blogPost.substring(0, 100) + '...');
```

### Data Analysis and Summarization

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function analyzeData(data, analysisType) {
  const zai = await ZAI.create();

  const prompts = {
    summarize: 'You are a data analyst. Summarize the key insights from the data.',
    trend: 'You are a data analyst. Identify trends and patterns in the data.',
    recommendation: 'You are a business analyst. Provide actionable recommendations based on the data.'
  };

  const systemPrompt = prompts[analysisType] || prompts.summarize;

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'assistant', content: systemPrompt },
      { role: 'user', content: `Analyze this data:\n\n${JSON.stringify(data, null, 2)}` }
    ],
    thinking: { type: 'disabled' }
  });

  return completion.choices[0]?.message?.content;
}

// Usage
const salesData = {
  Q1: { revenue: 100000, customers: 250 },
  Q2: { revenue: 120000, customers: 280 },
  Q3: { revenue: 150000, customers: 320 },
  Q4: { revenue: 180000, customers: 380 }
};

const trends = await analyzeData(salesData, 'trend');
console.log('Trends:', trends);
```

### Code Generation and Debugging

```javascript
import ZAI from 'z-ai-web-dev-sdk';

class CodeAssistant {
  constructor() {
    this.zai = null;
  }

  async initialize() {
    this.zai = await ZAI.create();
  }

  async generateCode(description, language) {
    return this.zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: `You are an expert ${language} programmer. Write clean, efficient, and well-commented code.`
        },
        {
          role: 'user',
          content: `Write ${language} code to: ${description}`
        }
      ],
      thinking: { type: 'disabled' }
    }).then(c => c.choices[0]?.message?.content);
  }

  async debugCode(code, issue) {
    return this.zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: 'You are an expert debugger. Identify bugs and suggest fixes.'
        },
        {
          role: 'user',
          content: `Code:\n${code}\n\nIssue: ${issue}\n\nFind the bug and suggest a fix.`
        }
      ],
      thinking: { type: 'disabled' }
    }).then(c => c.choices[0]?.message?.content);
  }
}

// Usage
const codeAssist = new CodeAssistant();
await codeAssist.initialize();

const bugFix = await codeAssist.debugCode(
  'function add(a, b) { return a - b; }',
  'This function should add numbers but returns wrong results'
);
console.log('Debug Suggestion:', bugFix);
```

## Best Practices

### 1. Prompt Engineering

Focus on specific goals, format, and audience in the system prompt and user message.

```javascript
// Good: Specific and structured prompt for clear output
async function askWithContext(topic, format, audience) {
  const zai = await ZAI.create();
  
  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'assistant',
        content: `You are an expert educator. Explain topics clearly for ${audience}.`
      },
      {
        role: 'user',
        content: `Explain ${topic} in ${format} format. Include practical examples.`
      }
    ],
    thinking: { type: 'disabled' }
  });

  return completion.choices[0]?.message?.content;
}

const goodResponse = await askWithContext('artificial intelligence', 'bullet points', 'beginners');
console.log(goodResponse);
```

### 2. Robust Error Handling and Retries

Implement exponential backoff for network or rate-limiting errors.

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function safeCompletion(messages, retries = 3) {
  let lastError;
  const zai = await ZAI.create(); // Create instance outside the loop if possible

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const completion = await zai.chat.completions.create({
        messages: messages,
        thinking: { type: 'disabled' }
      });

      const response = completion.choices[0]?.message?.content;

      if (!response || response.trim().length === 0) {
        throw new Error('Empty response from AI');
      }

      return { success: true, content: response, attempts: attempt };
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt < retries) {
        // Exponential backoff: 1s, 2s, 4s delay
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }
  }

  return { success: false, error: lastError.message, attempts: retries };
}
```

### 3. Context Management (Trimming)

Limit the conversation history sent to the LLM to manage costs and prevent token overflow.

```javascript
class ManagedConversation {
  constructor(maxMessages = 20) {
    this.maxMessages = maxMessages;
    this.systemPrompt = '';
    this.messages = [];
    this.zai = null;
  }

  async initialize(systemPrompt) {
    this.zai = await ZAI.create();
    this.systemPrompt = systemPrompt;
    this.messages = [{ role: 'assistant', content: systemPrompt }];
  }

  async chat(userMessage) {
    // 1. Add user message
    this.messages.push({ role: 'user', content: userMessage });

    // 2. Trim old messages if exceeding limit (Keep system prompt always at index 0)
    if (this.messages.length > this.maxMessages) {
      this.messages = [
        this.messages[0], 
        ...this.messages.slice(-(this.maxMessages - 1)) // Keep the (maxMessages - 1) most recent turns
      ];
    }

    // 3. Get completion
    const completion = await this.zai.chat.completions.create({
      messages: this.messages,
      thinking: { type: 'disabled' }
    });

    const response = completion.choices[0]?.message?.content;

    // 4. Add assistant response
    this.messages.push({ role: 'assistant', content: response });

    return response;
  }
}
```

### 4. Structured Response Processing

Force the model to output a specific format (e.g., JSON) for easier integration.

```javascript
import ZAI from 'z-ai-web-dev-sdk';

async function getStructuredResponse(query, format = 'json') {
  const zai = await ZAI.create();

  const formatInstructions = {
    json: 'Respond with valid JSON only. Define keys: "language", "useCase", "difficulty". No additional text outside the JSON object.',
    list: 'Respond with a numbered list.',
    markdown: 'Respond strictly in Markdown format.'
  };

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: 'assistant',
        content: `You are a helpful assistant. ${formatInstructions[format]}`
      },
      {
        role: 'user',
        content: query
      }
    ],
    thinking: { type: 'disabled' }
  });

  const response = completion.choices[0]?.message?.content;

  // Parse JSON if requested
  if (format === 'json') {
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse JSON response. Raw output:', response);
      return null;
    }
  }

  return response;
}

// Usage
const structuredData = await getStructuredResponse(
  'List three programming languages suitable for web development',
  'json'
);
console.log(structuredData);
```

## Integration Example

### Express.js Chatbot API

Demonstrates reusing the SDK instance and managing session history in a server environment.

```javascript
import express from 'express';
import ZAI from 'z-ai-web-dev-sdk';

const app = express();
app.use(express.json());

// Store conversations in memory (Use database/Redis in production)
const conversations = new Map();
let zaiInstance; // Reusable SDK instance

async function initZAI() {
  zaiInstance = await ZAI.create();
}

app.post('/api/chat', async (req, res) => {
  if (!zaiInstance) return res.status(503).json({ error: 'AI service initializing' });
  
  try {
    const { sessionId, message, systemPrompt } = req.body;

    if (!message || !sessionId) {
      return res.status(400).json({ error: 'sessionId and message are required' });
    }

    // Get or initialize conversation history
    let history = conversations.get(sessionId);

    if (!history) {
      // Initialize with system prompt
      history = [
        {
          role: 'assistant',
          content: systemPrompt || 'You are a helpful assistant.'
        }
      ];
    }
    
    // Add user message
    history.push({ role: 'user', content: message });

    // Ensure context trimming is applied here for production (See Best Practices 3)

    // Get completion
    const completion = await zaiInstance.chat.completions.create({
      messages: history,
      thinking: { type: 'disabled' }
    });

    const aiResponse = completion.choices[0]?.message?.content;

    // Add AI response to history
    history.push({ role: 'assistant', content: aiResponse });

    // Save updated history
    conversations.set(sessionId, history);

    res.json({
      success: true,
      response: aiResponse,
      messageCount: history.length - 1
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/chat/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  conversations.delete(sessionId);
  res.json({ success: true, message: `Conversation ${sessionId} cleared` });
});

initZAI().then(() => {
  app.listen(3000, () => {
    console.log('Chatbot API running on port 3000');
  });
});
```

## Performance & Security Summary

| Aspect | Tip | Rationale |
| :--- | :--- | :--- |
| **Performance** | **Reuse SDK Instance**: Create `ZAI.create()` once. | Avoids unnecessary initialization overhead per request. |
| **Performance** | **Context Trimming**: Limit `messages` array size. | Reduces API latency and avoids token limits/high costs. |
| **Performance** | **Specific Prompts**: Use clear, concise system prompts. | Improves model efficiency and response quality. |
| **Reliability** | **Error Handling**: Implement retry logic with exponential backoff. | Gracefully handles transient network or rate-limiting errors. |
| **Security** | **Backend Only**: Never expose `z-ai-web-dev-sdk` client-side. | Protects API keys and backend infrastructure. |
| **Security** | **Input Validation**: Sanitize all user messages. | Mitigates prompt injection and abuse. |

## Remember

- Always use `z-ai-web-dev-sdk` in **backend code only**.
- Use the **`assistant` role** for system/context prompts in `z-ai-web-dev-sdk`.
- Set `thinking: { type: 'disabled' }` for standard, low-latency completions.
- Implement session management and context trimming for multi-turn apps.