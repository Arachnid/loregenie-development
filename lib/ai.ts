"use server"

import OpenAI from 'openai';
import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam } from 'openai/resources';
const { OPENAI_API_KEY } = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
  
const PROMPT_TEMPLATE = (kind: string, prompt: string, context: Array<string>, template: string) => `
The user is requesting a ${kind}. Here is relevant context to the setting in which this ${kind} exists:

${context.map((c) => `---\n${c}\n---`).join('\n')}

Respond with a JSON object, following this template exactly:

---
${template}
---

`;

const model = 'gpt-4-1106-preview';
const imageModel = 'dall-e-3';

function formatObject(obj: {[key: string]: any}): string {
  return Object.keys(obj).map((key) => ` - ${key}: ${obj[key]}`).join('\n');
}

export async function aiGenerate<T>(
  kind: string, 
  template: {[Property in keyof T]: string}, 
  context: Array<{[key: string]: string}>, 
  prompt: string, 
  messageHistory?: Array<ChatCompletionMessageParam> // Optional message history
): Promise<{ response: T; messages: Array<ChatCompletionMessageParam> }> {
  
  // Formatting prompt
  const fullPrompt = PROMPT_TEMPLATE(kind, prompt, context.map((c) => formatObject(c)), formatObject(template));

  // Preparing messages array
  const messages: Array<ChatCompletionMessageParam> = messageHistory ? [...messageHistory] : [];

  // Check if a similar system message already exists in message history
  const hasSimilarSystemMessage = messages.some(message => 
      message.role === 'system' && message.content === fullPrompt
  );

  // Add system message if not already present
  if (!hasSimilarSystemMessage) {
      messages.push({role: 'system', content: fullPrompt});
  }

  // Add the user prompt message
  messages.push({role: 'user', content: prompt});

  // console.log(JSON.stringify(messages, undefined, 2));

  // Call to Open AI
  const result = await openai.chat.completions.create({
      messages,
      model,
      response_format: {type: 'json_object'},
  });

  return {
    response: JSON.parse(result.choices[0].message.content as string) as T,
    messages
  };
}


export async function aiGenerateImage(prompt: string, size: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792'): Promise<string> {
  const result = await openai.images.generate({
    model: imageModel,
    prompt,
    n: 1,
    size,
    response_format: 'b64_json',
  });
  return result.data[0].b64_json as string;
}


export async function modifyResponse<T>(prompt: string, messageHistory: Array<ChatCompletionMessageParam>): Promise<any> {
  
  const messages: Array<ChatCompletionMessageParam> = [...messageHistory, {role: 'user', content: prompt}];

  console.log({mESSAopenAi: messages});

  // Call to Open AI
  const result = await openai.chat.completions.create({
      messages,
      model,
      response_format: {type: 'json_object'},
  });

console.log({openAi: result})

return {
  response: JSON.parse(result.choices[0].message.content as string) as T,
  messages
};

}