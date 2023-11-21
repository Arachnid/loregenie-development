import OpenAI from 'openai';
import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam } from 'openai/resources';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

export async function aiGenerate<T>(kind: string, template: {[Property in keyof T]: string}, context: Array<{[key: string]: string}>, prompt: string): Promise<T> {
    const fullPrompt = PROMPT_TEMPLATE(kind, prompt, context.map((c) => formatObject(c)), formatObject(template));
    console.log({fullPrompt})
    const messages: Array<ChatCompletionMessageParam> = [
      {role: 'system', content: fullPrompt},
      {role: 'user', content: prompt},
    ];
    console.log(JSON.stringify(messages, undefined, 2));
    const result = await openai.chat.completions.create({
        messages,
        model,
        response_format: {type: 'json_object'},
    });
    return JSON.parse(result.choices[0].message.content as string) as T;
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