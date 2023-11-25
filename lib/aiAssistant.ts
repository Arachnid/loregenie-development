import OpenAI, { ClientOptions } from 'openai';
import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam } from 'openai/resources';
const { OPENAI_API_KEY } = process.env;
import fs, { stat } from 'fs';
import { readDataFromFile } from '@/utils/storeMessages';
import path from 'path';


class AiAssistant {
  private openai: OpenAI;
  private assistantId: string = '';
  private APIKEY: ClientOptions = { apiKey: OPENAI_API_KEY } ;
  private worldId: string = '';
  private fileId: string = '';
  private threadId: string = '';
  private runId: string = '';
  private runStatus: string;
  private toolCalls: any;
  private toolOuputs: any;
  

  constructor({ worldId }:{ worldId: string }) {
    this.worldId = worldId;
    this.openai = new OpenAI(this.APIKEY);
  }




  private customFunctions(){

    enum contentType {
        world = 'world',
        campaign = "campaign"
    }

    return {
        generate_new_page_content: ( params :{type: contentType, prompt: string}) => {
            console.log('function callled to generate');
        },

    }
  }


  async uploadFile(){
    const filePath = path.join(process.cwd(), './messages', `${this.worldId}.json`);

  // Upload a file with an "assistants" purpose
    const file = await this.openai.files.create({
        file: fs.createReadStream(filePath),
        purpose: "assistants",
    });
    this.fileId = file.id;
  }

  async createAssistant() {
    
    const assistant = await this.openai.beta.assistants.create({
        
        instructions: "You are a helpful assistant, use the knowledge base provided to answer questions and use the functions provided when neccessary",
        model: "gpt-4-1106-preview",
        tools: [{
            "type": "function",
            "function": {
              "name": "generate_new_page_content",
              "description": "Generates a new page content based on a prompt",
              "parameters": {
                "type": "object",
                "properties": {
                  "type": {"type": "string", "enum": ["world", "campaign"] },
                  "prompt": {"type": "string", "description": "description of what to modify on the current object"}
                },
                "required": ["type, world"]
              }
            }
          }],
        file_ids: [this.fileId]
    });
    this.assistantId = assistant.id;
  }

  async createThread() {
    this.threadId = (await this.openai.beta.threads.create()).id;
  }

  async sendMessage(message: string) {
    const newMessage = await this.openai.beta.threads.messages.create( this.threadId, 
        {

        "role": "user",
        "content": message
      
       }
    );
    return newMessage;
  }

  async runThread() {
    const runs = await this.openai.beta.threads.runs.create( this.threadId, {
        assistant_id: this.assistantId,
        // instructions: ''
    });

    this.runId = runs.id;
  }


  async checkRunIfActionIsRequired(){ 
    let retrieval = await this.openai.beta.threads.runs.retrieve(this.threadId, this.runId);

    if(retrieval.status === "requires_action"){
        this.toolCalls = retrieval.required_action?.submit_tool_outputs.tool_calls;
        return true
    }

    return false;
 }


 async parseToolOutput() {
    // check if toolcall has been returned then return tooloutput
    
    if(this.toolCalls){

        const output = this.toolCalls.map(async (val: any) => {
            const functionName = val.function.name;
            const args = JSON.parse(val.function.arguments);

            if(functionName === "generate_new_page_content" ) {
                const funcResult = await this.customFunctions().generate_new_page_content(args);
                return {
                    tool_call_id: val.id,
                    output: funcResult
                }
            }
            });

        this.toolOuputs = output;
    } else{
        console.log('tool calls not yet defined by Assistant')
    }
 }

 async runAction(){
    if(!this.toolOuputs){
        console.log('Tool Outputs have not been set')
        return;
    }
    const run = await this.openai.beta.threads.runs.submitToolOutputs(
        this.threadId,
        this.runId,
        {
          tool_outputs: this.toolOuputs,
        }
      );
 }

 async checkStatus() {
    try {
        let retryCount = 0;
        const maxRetries = 20;

        while (retryCount < maxRetries) {
            let retrieval = await this.openai.beta.threads.runs.retrieve(this.threadId, this.runId);
            this.runStatus = retrieval.status;

            if (this.runStatus === "completed") {
                return retrieval;
            } else if (this.runStatus === "requires_action") {
                this.toolCalls = retrieval.required_action?.submit_tool_outputs.tool_calls;

                if (this.toolCalls) {
                    await this.parseToolOutput();
                    await this.runAction();
                }

                // Reset retryCount to start checking again
                retryCount = 0;
            } else if( this.runStatus === "failed" ) {

                throw new Error(retrieval.last_error?.message); 

            } else {
                await new Promise(resolve => setTimeout(resolve, 3000));
                retryCount++;
            }
        }

        throw new Error('Max retries reached without completion');
    } catch (error) {
        console.error(error);   
    }
}


  async getLatestMessage() {
    const messages = await this.openai.beta.threads.messages.list(this.threadId);

    const lastRunMessage = messages.data.filter(
        (messages) => messages.run_id === this.runId && messages.role === "assistant"
    ).pop();

    if(lastRunMessage) {
        return lastRunMessage?.content[0]
    }

    return null

  }


  async cancelRequest() {
    if (this.runStatus !== 'completed' && this.runStatus !== 'failed') {
        const run = await this.openai.beta.threads.runs.cancel(this.threadId, this.runId);
        console.log(run);
    }
}

    //requires_action
    // queued
    //
}
