import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: 'Method not allowed',
        });
    }

    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Răspunde doar cu: Gemini funcționează!',
        });

        return res.status(200).json({
            success: true,
            response: response.text,
        });

    } catch (error) {
        console.error('Gemini error:', error);

        return res.status(500).json({
            success: false,
            error: 'Gemini request failed',
        });
    }
}