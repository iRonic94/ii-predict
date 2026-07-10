import { supabase } from '../lib/supabase';

export async function getAllEpisodes() {
    return await supabase
        .from('episoade')
        .select('*')
        .order('episode_number', {
            ascending: true,
        });
}

export async function updateEpisodeDates(
    episodeId,
    opensAt,
    closesAt
) {
    return await supabase
        .from('episoade')
        .update({
            opens_at: opensAt,
            closes_at: closesAt,
        })
        .eq('id', episodeId);
}