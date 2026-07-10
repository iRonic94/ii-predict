import { supabase } from '../lib/supabase';

export async function hasUserVoted(userId, episodeId) {
    return await supabase
        .from('voturi')
        .select('id')
        .eq('user_id', userId)
        .eq('episode_id', episodeId);
}

export async function submitVotes(votes) {
    return await supabase
        .from('voturi')
        .insert(votes);
}

export async function getVotesByEpisode(episodeId) {
    return await supabase
        .from('voturi')
        .select('*')
        .eq('episode_id', episodeId);
}

export async function getUserVotes(userId) {
    return await supabase
        .from('voturi')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
}