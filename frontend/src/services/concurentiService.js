import { supabase } from '../lib/supabase';

export async function getConcurentiActivi() {
    return await supabase
        .from('concurenti')
        .select('*')
        .eq('active', true)
        .order('name');
}

export async function getTotiConcurentii() {
    return await supabase
        .from('concurenti')
        .select('*')
        .order('name');
}

export async function getConcurent(id) {
    return await supabase
        .from('concurenti')
        .select('*')
        .eq('id', id)
        .single();
}