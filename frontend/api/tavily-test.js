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
                query: 'Insula Iubirii România următorul episod data ora difuzare',
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