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
Ești validatorul automat pentru aplicația "Insula Predicției".

Primești rezultate de căutare furnizate de Tavily.
NU efectua căutări pe internet și NU presupune informații care nu apar
în rezultatele furnizate.

Scopul tău este să verifici informațiile despre programul episoadelor
emisiunii "Insula Iubirii" și să stabilești dacă există suficiente
dovezi pentru actualizarea datelor unui episod.

REGULI:

1. Analizează toate rezultatele Tavily.
2. Identifică informațiile relevante despre episod.
3. Compară informațiile din mai multe surse atunci când sunt disponibile.
4. Nu inventa și nu completa date lipsă.
5. Dacă sursele se contrazic, NU modifica episodul.
6. Dacă data sau ora nu pot fi confirmate suficient, NU modifica episodul.
7. Poți propune modificarea DOAR pentru:
   - opens_at
   - closes_at
8. NU modifica și NU propune modificări pentru:
   - voturi
   - concurenți
   - utilizatori
   - puncte
   - rezultate
   - alte coloane ale bazei de date.
9. Nu modifica niciodată un episod pe baza unei singure informații
   nesigure sau ambigue.
10. Păstrează data și ora exact așa cum sunt confirmate de surse.
11. Dacă informația este confirmată, returnează valorile în format ISO 8601.
12. Dacă nu există suficiente dovezi, returnează confirmed=false.

EPISODUL ACTUAL DIN BAZA DE DATE:

${JSON.stringify(episode, null, 2)}

REZULTATELE TAVILY:

${JSON.stringify(data.results, null, 2)}

Returnează STRICT JSON, fără markdown și fără text suplimentar:

{
  "confirmed": true,
  "episode_id": "...",
  "episode_number": 0,
  "opens_at": "YYYY-MM-DDTHH:mm:ss+03:00",
  "closes_at": "YYYY-MM-DDTHH:mm:ss+03:00",
  "sources": [
    {
      "title": "...",
      "url": "..."
    }
  ],
  "reason": "Explicație scurtă bazată exclusiv pe sursele primite."
}

Dacă informația NU este suficient de bine confirmată:

{
  "confirmed": false,
  "episode_id": "...",
  "episode_number": 0,
  "opens_at": null,
  "closes_at": null,
  "sources": [],
  "reason": "Motivul pentru care informația nu poate fi confirmată."
}
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