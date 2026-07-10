import { supabase } from '../lib/supabase';

export async function getAllEpisodes() {
    return await supabase
        .from('episoade')
        .select('*')
        .order('opens_at');
}