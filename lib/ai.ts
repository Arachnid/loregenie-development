import {Configuration, OpenAIApi} from 'openai';

const openaiConfig = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(openaiConfig);
  
const PROMPT_TEMPLATE = (kind: string, prompt: string, context: Array<string>, template: string) => `${context.map((c) => `---\n${c}\n---`).join('\n')}

Generate a ${kind} using the prompt "${prompt}". Follow this template exactly:

---
${template}
---

`;

function formatObject(obj: {[key: string]: any}): string {
  return Object.keys(obj).map((key) => `${key}: ${obj[key]}`).join('\n');
}

function parseObject(obj: string): {[key: string]: string} {
  const result: {[key: string]: string} = {};
  const lines = obj.split('\n');
  let currentKey = '';
  for (const line of lines) {
    if(line.trim() == '') continue;
    if(line.trim().startsWith('---')) continue;
    if (line.includes(':')) {
      const idx = line.indexOf(':');
      currentKey = line.substring(0, idx).toLowerCase().trim();
      result[currentKey] = line.substring(idx + 1);
    } else {
      result[currentKey] = (result[currentKey] + '\n' + line).trim();
    }
  }
  return result;
}

export async function aiGenerate<T>(kind: string, template: {[Property in keyof T]: string}, context: Array<{[key: string]: any}>, prompt: string): Promise<T> {
    const fullPrompt = PROMPT_TEMPLATE(kind, prompt, context.map((c) => formatObject(c)), formatObject(template));
    const result = await openai.createCompletion({
        prompt: fullPrompt,
        model: 'text-davinci-003',
        max_tokens: 512,
        temperature: 0.7,
        stop: ['\n---\n'],
    });
    return parseObject(result.data.choices[0].text as string) as T;
}
