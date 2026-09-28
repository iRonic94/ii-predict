export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: 'Method not allowed',
        });
    }

    try {
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                api_key: process.env.TAVILY_API_KEY,
                query: `
                    Caută informații actuale și verificabile despre emisiunea
                    "Insula Iubirii" din România.

                    Verifică următoarele:

                    1. Programul următoarelor episoade:
                       - numărul episodului
                       - data difuzării
                       - ora difuzării
                       - eventuale modificări sau decalări ale programului

                    2. Pentru episoadele care au fost deja difuzate:
                       - dacă s-a aprins flacăra
                       - pentru cine s-a aprins flacăra
                       - numele concurenților implicați

                    3. Dacă un episod a fost amânat, mutat sau nu mai este
                       programat la data inițială, caută informații care confirmă
                       acest lucru.

                    Folosește surse cât mai recente și relevante.
                    Returnează rezultatele găsite și sursele acestora.
                `,
                search_depth: 'basic',
                topic: 'general',
                max_results: 5,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                success: false,
                error: data,
            });
        }

        return res.status(200).json({
            success: true,
            results: data.results,
        });

    } catch (error) {
        console.error('Tavily error:', error);

        return res.status(500).json({
            success: false,
            error: error?.message || String(error),
        });
    }
}