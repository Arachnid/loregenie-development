import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
  
const PROMPT_TEMPLATE = (kind: string, prompt: string, context: Array<string>, template: string) => `${context.map((c) => `---\n${c}\n---`).join('\n')}

The user is requesting a ${kind}. Respond with a JSON object, following this template exactly:

---
${template}
---

`;

const model = 'gpt-4-1106-preview';
const imageModel = 'dall-e-3';

function formatObject(obj: {[key: string]: any}): string {
  return Object.keys(obj).map((key) => ` - ${key}: ${obj[key]}`).join('\n');
}

export async function aiGenerate<T>(kind: string, template: {[Property in keyof T]: string}, context: Array<{[key: string]: any}>, prompt: string): Promise<T> {
    const fullPrompt = PROMPT_TEMPLATE(kind, prompt, context.map((c) => formatObject(c)), formatObject(template));
    const result = await openai.chat.completions.create({
        messages: [
          {role: 'system', content: fullPrompt},
          {role: 'user', content: prompt},
        ],
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