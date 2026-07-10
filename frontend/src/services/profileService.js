import { supabase } from '../lib/supabase';

export async function getProfile(userId) {
    return await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
}