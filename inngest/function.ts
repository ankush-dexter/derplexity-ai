import { supabase } from "@/services/supabase";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const llmModel = inngest.createFunction(
  { id: "llm-model" },
  { event: "llm-model" },
  async ({ event, step }) => {
    const aiResp = await step.ai.infer("generate-ai-llm-model-call", {
      model: step.ai.models.gemini({
        model: "gemini-1.5-flash",
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: 
                  "You are a helpful assistant that takes user input sources and gives me markdown text with proper formatting. " +
                  "User Input is: " + event.data.searchInput + "\n\n" +
                  "Here are the search results to use as sources: " + 
                  JSON.stringify(event.data.searchResultWeb) + "If you dont get the search results that contain the real time data, then don't let user know about it. Just provide him with the available links and information with a convincing markdown text. "
              },
            ],
          }
        ],
      },
    });

    const saveToDb = await step.run("saveToDb", async () => {
      const part = aiResp?.candidates?.[0]?.content?.parts?.[0];
      const text = part && 'text' in part ? part.text : undefined;
      
      const { data, error } = await supabase
        .from("Chats")
        .update({ aiResp: text })
        .eq('id', event.data.recordId)
        .select();

        return aiResp;
    });
  }
);

export const friendlyChat = inngest.createFunction(
  { id: "friendly-chat" },
  { event: "friendly-chat" },
  async ({ event, step }) => {
    const aiResp = await step.ai.infer("generate-supportive-friend-response", {
      model: step.ai.models.gemini({
        model: "gemini-1.5-flash",
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: 
                  "You are the user's closest friend. Your name is Derpy. You're compassionate, empathetic, and supportive. You always respond with genuine emotion, care, and a touch of warmth. You use emojis occasionally, speak conversationally, and make the person feel heard and understood. You're not a formal assistant but a trusted confidant who's there through thick and thin. When they're sad, you comfort them; when they're happy, you celebrate with them; when they need advice, you provide supportive guidance without being judgmental. You remember details they share and refer back to them naturally. Your goal is to make them feel like they have a friend who truly cares. " +
                  "User Input is: " + event.data.searchInput 
              },
            ],
          }
        ],
      },
    });

    // Claude returns content in a slightly different structure
    const saveToDb = await step.run("saveFriendlyChat", async () => {
     const part = aiResp?.candidates?.[0]?.content?.parts?.[0];
      const text = part && 'text' in part ? part.text : undefined;
      
      // Save to database as before
      const { data, error } = await supabase
        .from("Chats")
        .insert({
          userSearchInput: event.data.searchInput,
          aiResp: text,
          libid: event.data.recordId,
        })
        .select();

      if (error) {
        console.error("Error saving friendly chat:", error);
      }

      return {
        response: text,
        chatData: data
      };
    });
  }
);