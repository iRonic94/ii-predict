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
            model: 'gemini-3.8-flash',
            contents: `
                Caută pe internet informații actuale despre
                următoarea difuzare a emisiunii "Insula Iubirii"
                din România.

                Vreau să afli:
                1. Care este următorul episod care urmează să fie difuzat.
                2. Data difuzării.
                3. Ora difuzării.
                4. Sursele care confirmă informația.

                Nu presupune informații.
                Dacă nu poți confirma data și ora, spune clar acest lucru.

                Răspunde STRICT în format JSON,
                fără markdown și fără text înainte sau după JSON.
            `,
            config: {
                tools: [
                    {
                        googleSearch: {},
                    },
                ],
            },
        });

        return res.status(200).json({
            success: true,
            response: response.text,
        });

    } catch (error) {
        console.error('Gemini Search error:', error);

        return res.status(500).json({
            success: false,
            error: error?.message || String(error),
        });
    }
}