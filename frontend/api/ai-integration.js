import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    console.log('========== AI API TEST ==========');
    console.log('AI API VERSION: 2026-TEST-1');

    console.log(
        'SUPABASE_URL exists:',
        !!process.env.SUPABASE_URL
    );

    console.log(
        'SUPABASE_SERVICE_ROLE_KEY exists:',
        !!process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log(
        'SUPABASE_SERVICE_ROLE_KEY length:',
        process.env.SUPABASE_SERVICE_ROLE_KEY
            ? process.env.SUPABASE_SERVICE_ROLE_KEY.length
            : 0
    );

    try {
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { data, error } = await supabase
            .from('episoade')
            .select('id, episode_number, opens_at, closes_at')
            .limit(1);

        console.log('SUPABASE DATA:', data);
        console.log('SUPABASE ERROR:', error);

        return res.status(200).json({
            success: !error,
            version: '2026-TEST-1',
            url_exists: !!process.env.SUPABASE_URL,
            service_role_exists:
                !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            service_role_length:
                process.env.SUPABASE_SERVICE_ROLE_KEY
                    ? process.env.SUPABASE_SERVICE_ROLE_KEY.length
                    : 0,
            data,
            error: error?.message || null,
        });

    } catch (error) {
        console.error('AI API ERROR:', error);

        return res.status(500).json({
            success: false,
            version: '2026-TEST-1',
            error: error?.message || String(error),
        });
    }
}