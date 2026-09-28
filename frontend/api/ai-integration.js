import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed',
        });
    }

    try {
        /*
        ============================================================
        1. CITIM EPISOADELE DIN SUPABASE
        ============================================================
        */

        const { data: episodes, error: episodesError } =
            await supabase
                .from('episoade')
                .select(`
                    id,
                    created_at,
                    episode_number,
                    title,
                    opens_at,
                    closes_at,
                    validated
                `)
                .order('episode_number', {
                    ascending: true,
                });

        if (episodesError) {
            console.error(
                'Supabase episodes error:',
                episodesError
            );

            return res.status(500).json({
                success: false,
                error: 'Nu am putut citi episoadele din Supabase.',
                details: episodesError.message,
            });
        }

        /*
        ============================================================
        2. TAVILY - CĂUTĂM INFORMAȚII ACTUALE
        ============================================================
        */

        const tavilyResponse = await fetch(
            'https://api.tavily.com/search',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    api_key: process.env.TAVILY_API_KEY,

                    query: `
                        Caută informații actuale și verificabile despre
                        emisiunea "Insula Iubirii" din România.

                        Verifică în special programul episoadelor:

                        1. Care sunt următoarele episoade care urmează
                           să fie difuzate.

                        2. Pentru fiecare episod identificat:
                           - numărul episodului;
                           - data difuzării;
                           - ora difuzării.

                        3. Verifică dacă au existat:
                           - decalări;
                           - amânări;
                           - modificări ale programului;
                           - schimbări ale zilei sau orei de difuzare.

                        4. Dacă un episod a fost mutat sau amânat,
                           caută informații care confirmă noua dată
                           și noua oră.

                        Folosește surse cât mai recente și relevante.

                        Nu inventa informații.
                        Returnează rezultatele găsite și sursele acestora.
                    `,

                    search_depth: 'basic',

                    topic: 'general',

                    max_results: 10,
                }),
            }
        );

        const tavilyData = await tavilyResponse.json();

        if (!tavilyResponse.ok) {
            console.error(
                'Tavily error:',
                tavilyData
            );

            return res.status(tavilyResponse.status).json({
                success: false,
                error: 'Tavily search failed.',
                details: tavilyData,
            });
        }

        /*
        ============================================================
        3. GEMINI - ANALIZEAZĂ REZULTATELE TAVILY
        ============================================================
        */

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',

            contents: `
Ești sistemul automat de validare pentru aplicația
"Insula Predicției".

Primești:

1. Lista episoadelor existente în baza de date.
2. Rezultatele unei căutări web realizate de Tavily.

Rolul tău este să verifici dacă programul episoadelor din baza
de date trebuie actualizat.

IMPORTANT:

- NU efectua căutări pe internet.
- NU folosi Google Search.
- Folosește exclusiv informațiile furnizate de Tavily.
- NU inventa informații.
- NU presupune date care nu apar în surse.
- Dacă sursele se contrazic, nu confirma modificarea.
- Dacă informația este insuficientă, nu confirma modificarea.

============================================================
EPISOADE EXISTENTE ÎN SUPABASE
============================================================

${JSON.stringify(episodes, null, 2)}

============================================================
REZULTATE TAVILY
============================================================

${JSON.stringify(tavilyData.results, null, 2)}

============================================================
SCHEMA TABELULUI "episoade"
============================================================

Tabelul conține:

- id
- created_at
- episode_number
- title
- opens_at
- closes_at
- validated

============================================================
CE AI VOIE SĂ MODIFICI
============================================================

Poți propune modificări DOAR pentru:

- opens_at
- closes_at

Nu modifica și nu propune modificări pentru:

- id
- created_at
- episode_number
- title
- validated
- voturi
- concurenți
- utilizatori
- puncte
- rezultate

============================================================
REGULI PENTRU PROGRAM
============================================================

Pentru fiecare episod:

1. Compară valorile actuale din Supabase cu informațiile
   găsite de Tavily.

2. Dacă data și ora sunt confirmate suficient de surse,
   propune actualizarea.

3. Dacă programul din baza de date este deja corect,
   NU propune o modificare inutilă.

4. Dacă episodul a fost mutat, amânat sau decalată difuzarea,
   identifică acest lucru.

5. Dacă există o nouă dată/oră confirmată, returnează noua
   valoare.

6. Dacă sursele se contrazic, returnează confirmed=false.

7. Dacă nu există suficiente informații, returnează
   confirmed=false.

8. Nu inventa niciodată data sau ora.

9. Pentru fiecare modificare trebuie să existe surse.

10. Datele trebuie returnate în format ISO 8601.

============================================================
FORMATUL RĂSPUNSULUI
============================================================

Returnează STRICT JSON.

Fără markdown.

Fără text înainte sau după JSON.

Format:

{
  "episodes": [
    {
      "episode_id": "...",
      "episode_number": 0,
      "action": "update_schedule",
      "opens_at": "YYYY-MM-DDTHH:mm:ss+03:00",
      "closes_at": "YYYY-MM-DDTHH:mm:ss+03:00",
      "confirmed": true,
      "sources": [
        {
          "title": "...",
          "url": "..."
        }
      ],
      "reason": "..."
    }
  ]
}

Dacă nu există nicio modificare confirmată:

{
  "episodes": []
}
`,

            config: {
                responseMimeType: 'application/json',
            },
        });

        /*
        ============================================================
        4. PARSĂM RĂSPUNSUL GEMINI
        ============================================================
        */

        let geminiResult;

        try {
            geminiResult = JSON.parse(response.text);
        } catch (parseError) {
            console.error(
                'Gemini JSON parse error:',
                parseError
            );

            return res.status(500).json({
                success: false,
                error: 'Gemini nu a returnat JSON valid.',
                gemini_response: response.text,
            });
        }

        /*
        ============================================================
        5. EXECUTĂM DOAR UPDATE-URILE PERMISE
        ============================================================
        */

        const updatedEpisodes = [];

        for (const item of geminiResult.episodes || []) {
            /*
            --------------------------------------------------------
            Trebuie să fie exact operația permisă.
            --------------------------------------------------------
            */

            if (item.action !== 'update_schedule') {
                continue;
            }

            /*
            --------------------------------------------------------
            Trebuie să fie confirmat.
            --------------------------------------------------------
            */

            if (item.confirmed !== true) {
                continue;
            }

            /*
            --------------------------------------------------------
            Trebuie să existe datele necesare.
            --------------------------------------------------------
            */

            if (
                !item.episode_id ||
                !item.opens_at ||
                !item.closes_at
            ) {
                continue;
            }

            /*
            --------------------------------------------------------
            Verificăm că episodul există în Supabase.
            --------------------------------------------------------
            */

            const existingEpisode = episodes.find(
                episode =>
                    episode.id === item.episode_id
            );

            if (!existingEpisode) {
                console.warn(
                    'Gemini a trimis un episode_id necunoscut:',
                    item.episode_id
                );

                continue;
            }

            /*
            --------------------------------------------------------
            Verificăm că numărul episodului corespunde.
            --------------------------------------------------------
            */

            if (
                Number(item.episode_number) !==
                Number(existingEpisode.episode_number)
            ) {
                console.warn(
                    'Episode number mismatch:',
                    {
                        gemini: item.episode_number,
                        database:
                            existingEpisode.episode_number,
                    }
                );

                continue;
            }

            /*
            --------------------------------------------------------
            UPDATE STRICT

            Gemini poate modifica DOAR:

            - opens_at
            - closes_at

            Nicio altă coloană.
            --------------------------------------------------------
            */

            const {
                data: updatedEpisode,
                error: updateError,
            } = await supabase
                .from('episoade')
                .update({
                    opens_at: item.opens_at,
                    closes_at: item.closes_at,
                })
                .eq('id', item.episode_id)
                .select(`
                    id,
                    created_at,
                    episode_number,
                    title,
                    opens_at,
                    closes_at,
                    validated
                `)
                .single();

            if (updateError) {
                console.error(
                    'Episode update error:',
                    updateError
                );

                continue;
            }

            updatedEpisodes.push({
                episode: updatedEpisode,
                sources: item.sources || [],
                reason: item.reason || null,
            });
        }

        /*
        ============================================================
        6. RĂSPUNS FINAL
        ============================================================
        */

        return res.status(200).json({
            success: true,

            /*
            Informațiile găsite de Tavily.
            */

            tavily: tavilyData.results,

            /*
            Decizia Gemini.
            */

            gemini: geminiResult,

            /*
            Episoadele modificate efectiv în Supabase.
            */

            updated_episodes: updatedEpisodes,
        });

    } catch (error) {
        console.error(
            'AI integration error:',
            error
        );

        return res.status(500).json({
            success: false,
            error: error?.message || String(error),
        });
    }
}