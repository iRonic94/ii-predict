import { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

import {
    login,
    register as authRegister,
    logout,
} from '../services/authService';

import {
    getProfile,
    updateProfile,
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

            const { data, error } = await getProfile(user.id);

            if (error) {
                console.error(error);
                setProfile(null);
                return;
            }

            const googleAvatar =
                user.user_metadata?.avatar_url ??
                user.user_metadata?.picture;

            if (data && !data.avatar_url && googleAvatar) {

                const { data: updatedProfile, error: updateError } =
                    await updateProfile(user.id, {
                        avatar_url: googleAvatar,
                    });

                if (updateError) {
                    console.error(updateError);
                    setProfile(data);
                    return;
                }

                setProfile(updatedProfile);
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

                        if (session?.user) {
                            await loadProfile(session.user);
                        }

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

    const register = async (userData) => {

        // Triggerul handle_new_user() creează automat profilul.
        // Aici doar înregistrăm utilizatorul.
        return await authRegister(userData);

    };

    const refreshProfile = async () => {

        if (!user) return;

        const { data } = await getProfile(user.id);

        setProfile(data);

    };

    const value = {
        user,
        session,
        profile,
        loading,
        login,
        register,
        logout,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

}