import { openai } from '@ai-sdk/openai';
import { auth } from '@/app/(auth)/auth';
import {experimental_transcribe as transcribe} from 'ai'

const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  throw new Error('Missing OpenAI API Key. Please set OPENAI_API_KEY in your .env');
}

/**
 * API route for transcribing audio files using OpenAI's Whisper model
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const userId = session.user.id;

    const formData = await request.formData();
    const audioFile = formData.get('file') as File;

    if (!audioFile) {
      return Response.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert to Uint8Array for better compatibility with AI SDK
    const arrayBuffer = await audioFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    console.log('🚀 ~ POST ~ audioFile:', audioFile);
    console.log('🚀 ~ POST ~ converting to Uint8Array, size:', uint8Array.length);
    
    const response = await transcribe({
      audio: uint8Array,
      model: openai.transcription('whisper-1'),
    });
    return Response.json({ text: response.text });
  } catch (error) {
    console.error('🚀 ~ POST ~ error:', error);
    return Response.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
} 
