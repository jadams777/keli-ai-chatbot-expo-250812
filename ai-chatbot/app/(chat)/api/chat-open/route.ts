import {
    type Message,
    convertToCoreMessages,
    createDataStreamResponse,
    streamText,
} from 'ai';
import { openai } from '@ai-sdk/openai';
import { regularPrompt } from '@/lib/ai/prompts';
import { generateUUID } from '@/lib/utils';
import { getWeather } from '@/lib/ai/tools/get-weather';

export async function POST(request: Request) {
    try {
        console.log(">> Request received");
        const { messages, modelId = 'gpt-4o-mini' } = await request.json();
        console.log(">> Messages:", messages);

        // Filter out empty assistant messages
        const filteredMessages = messages.filter((message: Message) => {
            return !(message.role === 'assistant' && (!message.content || message.content.trim() === ''));
        });
        
        console.log(">> Filtered Messages:", filteredMessages);
        const coreMessages = convertToCoreMessages(filteredMessages);
        const userMessageId = generateUUID();

        return createDataStreamResponse({
            execute: (dataStream) => {
                dataStream.writeData({
                    type: 'user-message-id',
                    content: userMessageId,
                });

                const result = streamText({
                    model: openai(modelId),
                    system: regularPrompt,
                    messages: coreMessages,
                    maxSteps: 5,
                    tools: {
                        getWeather,
                    },
                });

                result.mergeIntoDataStream(dataStream);
            },
        });

    } catch (error) {
        console.error("API Error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate response" }),
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
    }
}

export async function GET() {
    return new Response('Ready', { status: 200 });
}