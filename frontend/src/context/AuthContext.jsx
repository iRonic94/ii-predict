import { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import { login, register, logout } from '../services/authService';

import {
    getProfile,
    upsertProfile,
} from '../services/profileService';

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

            let { data, error } = await getProfile(user.id);

            if (error?.code === 'PGRST116') {

                const {
                    profile,
                    error: upsertError,
                } = await upsertProfile(user);

                if (upsertError) {
                    console.error(upsertError);
                    setProfile(null);
                    return;
                }

                setProfile(profile);
                return;

            }

            if (error) {
                console.error(error);
                setProfile(null);
                return;
            }

            setProfile(data);

        };

        const initializeSession = async () => {

            const {
                data: { session },
            } = await supabase.auth.getSession();

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await loadProfile(session.user);
            }

            setLoading(false);

        };

        initializeSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            async (event, session) => {

                setSession(session);
                setUser(session?.user ?? null);

                switch (event) {

                    case 'SIGNED_IN':
                        await loadProfile(session?.user);
                        break;

                    case 'SIGNED_OUT':
                        setProfile(null);
                        break;

                    default:
                        break;

                }

                setLoading(false);

            }
        );

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