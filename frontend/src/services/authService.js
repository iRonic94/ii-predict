import { supabase } from '../lib/supabase';

export async function register({ nickname, email, password }) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { data: null, error };
    }

    if (!data.user) {
        return {
            data: null,
            error: new Error('User could not be created.'),
        };
    }

    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: data.user.id,
            nickname,
            total_points: 0,
        });

    if (profileError) {
        return {
            data: null,
            error: profileError,
        };
    }

    return {
        data,
        error: null,
    };
}