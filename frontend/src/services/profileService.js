import { supabase } from '../lib/supabase';
import imageCompression from 'browser-image-compression';

export async function getProfile(userId) {
    return await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
}

export async function uploadAvatar(userId, file) {

    const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 300,
        useWebWorker: true,
        fileType: file.type,
    });
    const extension = compressedFile.type.split('/')[1];
    const filePath = `${userId}/avatar-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedFile, {
            cacheControl: '3600',
        });

    if (uploadError) {
        return {
            url: null,
            error: uploadError,
        };
    }

    const {
        data: { publicUrl },
    } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

    return {
        url: publicUrl,
        error: null,
    };

}

export async function updateAvatar(userId, avatarUrl) {

    return await supabase
        .from('profiles')
        .update({
            avatar_url: avatarUrl,
        })
        .eq('id', userId)
        .select()
        .single();

}
export async function upsertProfile(user) {

    const { data: existingProfile } = await getProfile(user.id);

    // Profilul există deja -> nu modificăm nimic
    if (existingProfile) {
        return {
            profile: existingProfile,
            error: null,
        };
    }

    const nickname =
        user.user_metadata?.nickname ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email.split('@')[0];

    const profile = {
        id: user.id,
        email: user.email,
        nickname,
        avatar_url:
            user.user_metadata?.avatar_url ??
            user.user_metadata?.picture ??
            null,
        total_points: 0,
    };

    const {
        data,
        error,
    } = await supabase
        .from('profiles')
        .insert(profile)
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

export async function getUserRank() {
    return await supabase.rpc('get_user_rank');
}

export async function updateProfile(userId, updates) {

    return await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

}