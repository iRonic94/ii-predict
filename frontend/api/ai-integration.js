import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
console.log(
    'SUPABASE_SERVICE_ROLE_KEY exists:',
    !!process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log(
    'SUPABASE_SERVICE_ROLE_KEY length:',
    process.env.SUPABASE_SERVICE_ROLE_KEY?.length
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

        const { data: episodes, error: episodesError } = await supabase
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
                        emisiunea Insula Iubirii strict pentru sezonul 10 din România.

                        Verifică următoarele:

                        1. Programul următoarelor episoade:
                           - numărul episodului;
                           - data difuzării;
                           - ora difuzării;
                           - eventualele modificări sau decalări
                             ale programului.

                        2. Pentru episoadele deja difuzate:
                           - dacă există informații despre flacără;
                           - pentru cine s-a aprins flacăra;
                           - numele concurenților sau cuplurilor
                             implicate.

                        3. Dacă un episod a fost:
                           - amânat;
                           - mutat;
                           - anulat;
                           - sau nu mai este programat la data
                             inițială.

                        Caută surse cât mai recente și relevante.

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
        3. GEMINI - ANALIZEAZĂ DOAR REZULTATELE TAVILY
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

Primești două tipuri de informații:

1. Episoadele existente în baza de date Supabase.
2. Rezultatele unei căutări web efectuate de Tavily.

IMPORTANT:

- NU efectua căutări pe internet.
- NU folosi Google Search.
- NU presupune informații care nu apar în rezultatele Tavily.
- NU inventa date.
- Folosește exclusiv informațiile furnizate.
- Compară informațiile Tavily cu datele existente în baza de date.

============================================================
EPISOADE EXISTENTE ÎN BAZA DE DATE
============================================================

${JSON.stringify(episodes, null, 2)}

============================================================
REZULTATELE TAVILY
============================================================

${JSON.stringify(tavilyData.results, null, 2)}

============================================================
REGULI PENTRU EPISOADE
============================================================

Tabelul "episoade" are următoarele coloane:

- id
- created_at
- episode_number
- title
- opens_at
- closes_at
- validated

Poți propune modificări DOAR pentru:

- opens_at
- closes_at

NU modifica și NU propune modificări pentru:

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
VALIDAREA PROGRAMULUI
============================================================

Pentru fiecare episod:

1. Compară data și ora existente în baza de date cu
   informațiile găsite de Tavily.

2. Dacă data și ora sunt confirmate suficient de sursele Tavily,
   poți propune actualizarea lor.

3. Dacă sursele se contrazic, NU propune actualizarea.

4. Dacă informația este insuficientă, NU propune actualizarea.

5. Nu inventa niciodată o dată sau o oră.

6. Dacă episodul a fost mutat sau decalată difuzarea,
   identifică explicit acest lucru.

7. Folosește format ISO 8601 pentru date.

8. Pentru fiecare actualizare trebuie să existe cel puțin
   o sursă relevantă în rezultatele Tavily.

============================================================
VOTURI
============================================================

Tabelul "voturi" conține:

- id
- user_id
- episode_id
- concurent_id
- created_at
- points_awarded

Voturile sunt DATE EXISTENTE și trebuie păstrate.

NU modifica, NU șterge și NU insera voturi.

În această etapă, voturile pot fi doar analizate ulterior
pentru validarea rezultatului unui episod.

============================================================
REZULTAT
============================================================

Returnează STRICT JSON.

Nu returna markdown.

Nu returna text înainte sau după JSON.

Formatul trebuie să fie:

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

IMPORTANT:

Nu include în "episodes" modificări care nu sunt confirmate.
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
        5. VALIDĂM ȘI EXECUTĂM UPDATE-URILE
        ============================================================
        */

        const updatedEpisodes = [];

        for (const item of geminiResult.episodes || []) {
            /*
            --------------------------------------------------------
            Verificăm că Gemini cere exact operația permisă.
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
            Trebuie să existe toate valorile necesare.
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
            Verificăm că episodul există cu adevărat în DB.
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
                        database: existingEpisode.episode_number,
                    }
                );

                continue;
            }

            /*
            --------------------------------------------------------
            UPDATE STRICT:
            
            DOAR opens_at și closes_at.
            
            Nu permitem Gemini să modifice alte coloane.
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
            Datele găsite de Tavily.
            Le păstrăm în răspuns pentru debugging/test.
            */
            tavily: tavilyData.results,

            /*
            Decizia lui Gemini.
            */
            gemini: geminiResult,

            /*
            Episoadele modificate efectiv.
            */
            updated_episodes: updatedEpisodes,
        });

    } catch (error) {
        console.error(
            'AI sync error:',
            error
        );

        return res.status(500).json({
            success: false,
            error: error?.message || String(error),
        });
    }
}