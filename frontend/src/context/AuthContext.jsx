import { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import { login, register, logout } from '../services/authService';
import { getProfile } from '../services/profileService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadProfile = async (user) => {

            if (!user) {
                setProfile(null);
                return;
            }

            const { data, error } = await getProfile(user.id);

            console.log('========== PROFILE DEBUG ==========');
            console.log('USER ID:', user.id);
            console.log('PROFILE DATA:', data);
            console.log('PROFILE ERROR:', error);
            console.log('===================================');

            if (error) {
                setProfile(null);
                return;
            }

            setProfile(data);
        };

        const getSession = async () => {

            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();

            console.log('SESSION:', session);
            console.log('SESSION ERROR:', error);

            setSession(session);
            setUser(session?.user ?? null);

            await loadProfile(session?.user);

            setLoading(false);
        };

        getSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {

            console.log('AUTH EVENT:', _event);
            console.log('NEW SESSION:', session);

            setSession(session);
            setUser(session?.user ?? null);

            await loadProfile(session?.user);

            setLoading(false);

        });

        return () => subscription.unsubscribe();

    }, []);

    const value = {
        user,
        session,
        profile,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}