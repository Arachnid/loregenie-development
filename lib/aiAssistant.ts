import OpenAI, { ClientOptions } from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
} from "openai/resources";
const { OPENAI_API_KEY } = process.env;
import fs, { stat } from "fs";
import { readDataFromFile } from "@/utils/storeMessages";
import path from "path";
import {
  MessageContentImageFile,
  MessageContentText,
} from "openai/resources/beta/threads/messages/messages";
import { World, WorldDB } from "@/types";

export class AiAssistant {
  private openai: OpenAI;
  private assistantId: string = "";
  private world: World = {} as World;
  private APIKEY: ClientOptions = { apiKey: OPENAI_API_KEY };
  private worldId: string = "";
  private fileId: string = "";
  private threadId: string = "";
  private runId: string = "";
  private runStatus: any;
  private toolCalls: any;
  private toolOuputs: any;
  private currentMessageObj: any;


  constructor( ) {
    // this.worldId = world.id;
    // this.world = world;
    this.openai = new OpenAI(this.APIKEY);
  }


  private getInstruction (kind: string, context: Array<string>) {
    return`
        The user is requesting a ${kind}. Here is relevant context to the setting in which this ${kind} exists:

        ${context.map((c) => `---\n${c}\n---`).join('\n')}

        Respond with a JSON object, following this template exactly:

        ---
        - name: Name for the setting
        - description: A detailed, 2-4 paragraph description of the setting
        - imagePrompt: A description of a header image that captures the setting, written in a way that someone who has never heard of the setting could paint a picture.
        ---

        `
    };

    private get template() {
        return {
            world: this.getInstruction('world', []),
            campaign: (id: string ) => this.getInstruction('campaign', [`name: ${this.world.campaigns.find(campaign => campaign.id === id)?.name}`, `description:  ${this.world.campaigns.find(campaign => campaign.id === id)?.description}`])
        };
      }


  private customFunctions() {

    enum contentType {
      world = "world",
      campaign = "campaign",
    }

    console.log("function called to generate");

    return {
      generate_new_page_content: async (params: {
        type: contentType;
        prompt: string;
      }) => {

        let template = this.template.world;

        const threadid = await this.createThread(true);
        const newMsg = await this.sendMessage(params.prompt, threadid);
        const run = await this.runThread(template, threadid);

        try {
            let retryCount = 0;
            const maxRetries = 20;
      
            while (retryCount < maxRetries) {
              let retrieval = await this.openai.beta.threads.runs.retrieve(
                threadid,
                run
              );
      
              if (retrieval.status === "completed") {

                console.log({retrieval});
                // save update to db / temporary storage
                return retrieval;

              } else if (retrieval.status === "failed") {
                throw new Error(retrieval.last_error?.message);
              } else {
                await new Promise((resolve) => setTimeout(resolve, 3000));
                retryCount++;
              }
            }
        
        } catch (error:any){
            console.log({error})
        }
      },
      
      update_page: ({type, context}:{type: string, context: any}) => {
        let contxt = context || [];

        const INSTRUCTION_FOR_WORLD_CREATION =
        `
          The user is requesting a ${type}. Here is relevant context to the setting in which this ${type} exists:

          ---\n description: ${contxt?.name}\n---\n
          ---\n description: ${contxt?.description}\n---\n

          Respond with a JSON object, following this template exactly, no markdown:
         
          ---
          - name: Name for the setting
          - description: A detailed, 2-4 paragraph description of the setting
          - imagePrompt: A description of a header image that captures the setting, written in a way that someone who has never heard of the setting could paint a picture.
          ---
  
        `;

        return INSTRUCTION_FOR_WORLD_CREATION;
        //get object from ai
        //clean object
        //store object in db
        // read world file  
        //update world file
    }
    };
  }

  async uploadFile( _filepath?: string ) {
    if(!this.worldId){
        return;
    }

    const filePath = _filepath ? _filepath : path.join(
      process.cwd(),
      "./messages",
      `${this.worldId}.json`
    );

    // Upload a file with an "assistants" purpose
    const file = await this.openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: "assistants",
    });
    this.fileId = file.id;
  }

  async createAssistant() {
    const fileIdArray = this.fileId ? [this.fileId] : undefined;
    const assistant = await this.openai.beta.assistants.create({
      instructions:
        "You are a helpful assistant, use the knowledge base provided to answer questions and follow the instructions exactly, and use the functions provided, if they are provided when neccessary",
      model: "gpt-4-1106-preview",
      tools: [
        {type: "code_interpreter"},
        // {type:"retrieval"},
        // {
        //   type: "function",
        //   function: {
        //     name: "generate_new_page_content",
        //     description: "this function generates content for the current page. a page could be either a world or a campaign. the function returns an object that will be used to update the page, name, description or imageprompt, base on the prompt provided",
        //     parameters: {
        //       type: "object",
        //       properties: {
        //         type: { type: "string", enum: ["world", "campaign"] },
        //         prompt: {
        //           type: "string",
        //           description:
        //             "description of what to modify on the current object",
        //         },
        //       },
        //       required: ["type, world"],
        //     },
        //   },
        // },
        {
          type: "function",
          function: {
            name: "update_page",
            description: "this function allow a user to get a prompt to update the current webpage. The response is a prompt that needs to be followed",
            parameters: {
              type: "object",
              properties: {
                type: { type: "string", enum: ["world", "campaign", "entry"] },
                context: {
                  type: "object",
                  properties:{
                    name:{type: "string", description: " This is the name of the world"},
                    description:{type: "string", description: " This is the description of the world"}
                  },
                },
              },
              required: ["type, context"],
            },
          },
        },
      ],
      file_ids: fileIdArray,
    });

    console.log({assistant: assistant });
    this.assistantId = assistant.id;
  }

  async retrieveAssistant({ assistantId }: { assistantId: string }) {
    try {
      const myAssistant = await this.openai.beta.assistants.retrieve(
        assistantId
      );
      this.assistantId = myAssistant.id;
    } catch (error: any) {
      console.log({ message: error.message });
    }
  }

  async createThread(external = false) {
    const threadId = (await this.openai.beta.threads.create()).id;

    if(!external){
        this.threadId = threadId;
    }
    return threadId
  }

  async sendMessage(message: string, _threadId?: string) {
    
    let threadId: string;

    if(_threadId) {
        threadId = _threadId;
    } else {
        threadId = this.threadId;
    }
    
    try {

        const newMessage = await this.openai.beta.threads.messages.create(
            threadId,
          {
            role: "user",
            content: message,
          }
    
        );
    
        this.currentMessageObj = newMessage;
    
        return newMessage;
        
    } catch (error: any) {
        console.log({msg: error.message, error})
    }
  }

  async runThread(instructions?: string, _threadId?: string, external = false) {
    let threadId: string;

    if(_threadId) {
        threadId = _threadId;
    } else {
        threadId = this.threadId;
    }

    const runs = await this.openai.beta.threads.runs.create(threadId, {
      assistant_id: this.assistantId,
      instructions
    });

    if(!external){
      this.runId = runs.id;
    }

    return runs.id;
  }

  async checkRunIfActionIsRequired() {
    let retrieval = await this.openai.beta.threads.runs.retrieve(
      this.threadId,
      this.runId
    );

    if (retrieval.status === "requires_action") {
      this.toolCalls =
        retrieval.required_action?.submit_tool_outputs.tool_calls;
      return true;
    }

    return false;
  }

  async parseToolOutput() {
    if (this.toolCalls) {
      const outputPromises = this.toolCalls.map(async (val: any) => {
        const functionName = val.function.name;
        const args = JSON.parse(val.function.arguments);
  
        if (functionName === "generate_new_page_content") {
          const funcResult = await this.customFunctions().generate_new_page_content(args);
          return {
            tool_call_id: val.id,
            output: funcResult,
          };
        } else if (functionName === "update_page") {
          const functionResult = await this.customFunctions().update_page({type: args.type, context: args.context});
          return {
            tool_call_id: val.id,
            output: functionResult,
          };
        }
      });
  
      const outputs = await Promise.all(outputPromises);
      console.log({ fnc_output: outputs });
      this.toolOuputs = outputs;
    } else {
      console.log("tool calls not yet defined by Assistant");
    }
  }
  

  async runAction() {
    if (!this.toolOuputs) {
      console.log("Tool Outputs have not been set");
      return;
    }

    try {

        const run = await this.openai.beta.threads.runs.submitToolOutputs(
            this.threadId,
            this.runId,
            {
              tool_outputs: this.toolOuputs,
            }
          );

    } catch (error: any) {
        console.error(error.message)    }
  }

  async checkStatus() {
    try {
      let retryCount = 0;
      const maxRetries = 20;

      while (retryCount < maxRetries) {
        let retrieval = await this.openai.beta.threads.runs.retrieve(
          this.threadId,
          this.runId
        );

        console.log({retrieval, action: retrieval.required_action?.submit_tool_outputs?.tool_calls[0].function})

        this.runStatus = retrieval.status;

        if (this.runStatus === "completed") {
          return retrieval;
        } else if (this.runStatus === "requires_action") {
          this.toolCalls =
            retrieval.required_action?.submit_tool_outputs.tool_calls;

          if (this.toolCalls) {
            await this.parseToolOutput();
            await this.runAction();
          }

          // Reset retryCount to start checking again
          retryCount = 0;
        } else if (this.runStatus === "failed") {
          throw new Error(retrieval.last_error?.message);
        } else {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          retryCount++;
        }
      }

      throw new Error("Max retries reached without completion");
    } catch (error) {
      console.error(error);
    }
  }

  async getLatestMessage() {
    const messages = await this.openai.beta.threads.messages.list(
      this.threadId
    );
    if (messages) {
      const lastRunMessage: OpenAI.Beta.Threads.Messages.ThreadMessage =
        messages.data
          .filter(
            (messages) =>
              messages.run_id === this.runId && messages.role === "assistant"
          )
          .pop()!;

      if (lastRunMessage) {
        const content: MessageContentText = lastRunMessage
          .content[0] as MessageContentText;
        return content.text.value;
      }
    }

    return null;
  }

  async cancelRequest({runId, threadId}: {runId?: string, threadId?: string}) {
    console.log('cancelling requests');
    let run_id;
    let thread_id;

    if(runId && threadId){
        run_id = runId;
        thread_id = threadId;
    } else {
        thread_id = this.threadId;
        run_id = this.runId;
    }

    if (this.runStatus !== "completed" && this.runStatus !== "failed") {
      const run = await this.openai.beta.threads.runs.cancel(
        run_id,
        thread_id
      );
      console.log(run);
    }
  }

  async startConversation({
    message = "hello",
    assistantId,
    threadId,
    fileId,
    threadInstruction,
    world,
    filePath,
  }: {
    message: string;
    assistantId?: string;
    threadId?: string;
    fileId?: string;
    threadInstruction?: string;
    world?: WorldDB | World;
    filePath?: string;
  }) {
    try {

        if(world){
            this.world = world as World;
            this.worldId = world.id;
        }

      //get file
      if (!fileId) {
        console.log('uplaoding file');
        await this.uploadFile(filePath);
      } else {
        this.fileId = fileId;
      }

      //create assistant / retrieve assistant
      if (!assistantId) {
        console.log('creating assistant');
        await this.createAssistant();
      } else {
        this.assistantId = assistantId;
      }

      // create thread / retrieve a thread
      if (!threadId) {
        console.log('creating thread');
        await this.createThread();
      } else {
        this.threadId = threadId;
      }

      //send message
      console.log('sending message to ai');
      await this.sendMessage(message);
      //run thread
      console.log('running thread created');
      await this.runThread(threadInstruction);
      //get status
      console.log('checking status of AI request..');
      await this.checkStatus();
      //get latest message
      console.log('getting response form AI');
      const response = await this.getLatestMessage();
      console.log({response});

      if (!response) {
        console.log('error happened')
        throw new Error("Something went wrong generating the response");
      }

      return {
        message,
        assistantId: assistantId || this.assistantId,
        threadId: threadId || this.threadId,
        fileId: fileId || this.fileId,
        assistant_response: response,
      };
    } catch (error) {
      console.log({ error });
    }
  }
}
