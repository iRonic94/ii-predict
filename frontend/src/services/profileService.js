import { supabase } from '../lib/supabase';

export async function getProfile(userId) {
    return await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
}

export async function upsertProfile(user) {

    const nickname =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email.split('@')[0];

    const profile = {
        id: user.id,
        email: user.email,
        nickname,
        avatar_url:
            user.user_metadata.avatar_url ??
            user.user_metadata.picture ??
            null,
        total_points: 0,
    };

    const {
        data,
        error,
    } = await supabase
        .from('profiles')
        .upsert(profile, {
            onConflict: 'id',
        })
        .select()
        .single();

    return {
        profile: data,
        error,
    };

}

export async function getRanking() {
    return await supabase
        .from('profiles')
        .select('*')
        .order('total_points', {
            ascending: false,
        });
}