import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY environment variable is not defined');
}
const genAI = new GoogleGenerativeAI(apiKey);  

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const result = await model.generateContent(message);
    const reply = result.response.text(); // Adjust based on actual response structure
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ reply: 'Error: Could not fetch response from Gemini' }, { status: 500 });
  }
}