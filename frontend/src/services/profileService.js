import { supabase } from '../lib/supabase';

export async function getProfile(userId) {
    return await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
}

export async function createProfile(user) {

    console.log('CREATE PROFILE CALLED');
    console.log(user);

    const nickname =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email.split('@')[0];

    console.log({
        id: user.id,
        email: user.email,
        nickname,
    });

    return await supabase
        .from('profiles')
        .insert({
            id: user.id,
            email: user.email,
            nickname,
            total_points: 0,
        });

}

export async function getRanking() {
    return await supabase
        .from('profiles')
        .select('*')
        .order('total_points', {
            ascending: false,
        });
}