import { supabase } from '../lib/supabase';

export async function register({ nickname, email, password }) {
    return await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                nickname,
            },
        },
    });
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