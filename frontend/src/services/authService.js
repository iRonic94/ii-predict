import { supabase } from '../lib/supabase';

export async function register({ nickname, email, password }) {
    // Creează utilizatorul în Auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { data: null, error };
    }

    // Creează profilul
    const { error: profileError } = await supabase
        .from('profiles')
        .insert({
            id: data.user.id,
            nickname,
            total_points: 0,
        });

    if (profileError) {
        return { data: null, error: profileError };
    }

    return { data, error: null };
}

export async function login(email, password) {
    return await supabase.auth.signInWithPassword({
        email,
        password,
    });
}

export async function logout() {
    return await supabase.auth.signOut();
}