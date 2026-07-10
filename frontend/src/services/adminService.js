import { supabase } from '../lib/supabase';

export async function saveEpisodeResults(results) {
    return await supabase
        .from('rezultate_episoade')
        .insert(results);
}

export async function clearEpisodeResults(episodeId) {
    return await supabase
        .from('rezultate_episoade')
        .delete()
        .eq('episode_id', episodeId);
}

export async function validateEpisode(episodeId) {
    return await supabase
        .from('episoade')
        .update({
            validated: true,
        })
        .eq('id', episodeId);
}
export async function calculateEpisodePoints(episodeId) {
    return await supabase.rpc('calculate_episode_points', {
        p_episode_id: episodeId,
    });
}