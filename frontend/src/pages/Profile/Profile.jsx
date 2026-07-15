import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import MainLayout from '../../components/layout/MainLayout/MainLayout';
import Button from '../../components/ui/Button/Button';

import avatarPlaceholder from '../../assets/ph_avatar.png';

import { useAuth } from '../../hooks/useAuth';

import './Profile.scss';

import { getUserRank, updateProfile } from '../../services/profileService';

function Profile() {

    const { profile, user, refreshProfile } = useAuth();

    const [nickname, setNickname] = useState(
        profile?.nickname || ''
    );

    const [rank, setRank] = useState(null);

    useEffect(() => {

        loadRank();

    }, []);

    const loadRank = async () => {

        const { data, error } = await getUserRank();

        if (error) {
            console.error(error);
            return;
        }

        setRank(data);

    };

    const handleSave = async () => {

        const nicknameTrimmed = nickname.trim();

        if (nicknameTrimmed.length < 3) {

            toast.error(
                'Nickname-ul trebuie să aibă minim 3 caractere.'
            );

            return;

        }

        const { error } = await updateProfile(
            user.id,
            {
                nickname: nicknameTrimmed,
            }
        );

        if (error) {

            toast.error(error.message);

            return;

        }

        await refreshProfile();

        toast.success(
            'Profil actualizat!'
        );

    };
    const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'default';
    return (

        <MainLayout>
            <section className="profile-page">
                <div className="profile-card">
                    <h1>
                        Profil
                    </h1>
                    <div className="profile-avatar-wrapper">
                        <img
                            src={
                                profile?.avatar_url ||
                                avatarPlaceholder
                            }
                            alt={profile?.nickname}
                            className="profile-avatar"
                        />
                        <span className="change-avatar-text">
                            Click pentru a schimba poza
                        </span>
                    </div>
                    <div className="profile-form">
                        <label>
                            Nickname
                            <small>
                                {nickname.length}/15
                            </small>
                            <input
                                type="text"
                                maxLength={15}
                                value={nickname}
                                onChange={(e) =>
                                    setNickname(e.target.value)} />
                        </label>
                        <div className="profile-stats">
                            <div>
                                <span>Total puncte</span>
                                <strong>
                                    {profile?.total_points}
                                </strong>
                            </div>
                            <div>
                                <span>Rank</span>
                                <strong className={`rank ${rankClass}`}>
                                    {rank === 1 && '🥇 '}
                                    {rank === 2 && '🥈 '}
                                    {rank === 3 && '🥉 '}
                                    #{rank}
                                </strong>
                            </div>
                        </div>
                        <Button fullWidth disabled={
                            nickname.trim() === profile?.nickname
                        } onClick={handleSave}>
                            Salvează modificările
                        </Button>
                        <Button fullWidth className="delete-account-btn">
                            Șterge contul
                        </Button>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

export default Profile;