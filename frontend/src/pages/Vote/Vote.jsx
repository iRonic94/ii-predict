import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import MainLayout from '../../components/layout/MainLayout/MainLayout';
import ContestantCard from '../../components/vote/ContestantCard/ContestantCard';
import EpisodeSelector from '../../components/vote/EpisodeSelector/EpisodeSelector';
import UpcomingEpisodeBanner from '../../components/vote/UpcomingEpisodeBanner/UpcomingEpisodeBanner';
import Button from '../../components/ui/Button/Button';

import { useAuth } from '../../hooks/useAuth';

import { getConcurentiActivi } from '../../services/concurentiService';
import { getAllEpisodes } from '../../services/episodeService';
import {
    hasUserVoted,
    submitVotes,
} from '../../services/voteService';

import './Vote.scss';

function Vote() {

    const {
        user,
        profile,
        loading,
    } = useAuth();

    const [episodes, setEpisodes] = useState([]);
    const [selectedEpisode, setSelectedEpisode] = useState(null);

    const [concurenti, setConcurenti] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const [previousVoteIds, setPreviousVoteIds] = useState([]);

    const [message, setMessage] = useState('');
    const isEpisodeOpen =
        selectedEpisode &&
        new Date() >= new Date(selectedEpisode.opens_at) &&
        new Date() <= new Date(selectedEpisode.closes_at);
    useEffect(() => {

        loadEpisodes();
        loadConcurenti();

    }, []);

    const loadEpisodes = async () => {

        const { data, error } = await getAllEpisodes();

        if (error) {
            console.error(error);
            return;
        }

        setEpisodes(data);

        const now = new Date();

        const activeEpisode = data.find((episode) => {

            const opensAt = new Date(episode.opens_at);
            const closesAt = new Date(episode.closes_at);

            return now >= opensAt && now <= closesAt;

        });

        setSelectedEpisode(activeEpisode ?? null);

    };
    const handleEpisodeSelect = async (episode) => {

        setSelectedEpisode(episode);
        setSelectedIds([]);
        setPreviousVoteIds([]);

        const isClosed =
            episode.opens_at &&
            episode.closes_at &&
            new Date() > new Date(episode.closes_at);

        if (!isClosed) {
            return;
        }

        const { data, error } = await hasUserVoted(
            user.id,
            episode.id
        );

        if (error) {
            console.error(error);
            return;
        }

        setPreviousVoteIds(
            data.map((vote) => vote.concurent_id)
        );
    };
    const loadConcurenti = async () => {

        const { data, error } =
            await getConcurentiActivi();

        if (error) {
            console.error(error);
            return;
        }

        const sortedConcurenti = [...data].sort((a, b) => {
            if (a.cuplu_number !== b.cuplu_number) {
                return a.cuplu_number - b.cuplu_number;
            }
            if (a.gender === 'F' && b.gender === 'M') {
                return -1;
            }
            if (a.gender === 'M' && b.gender === 'F') {
                return 1;
            }
            return 0;
        });
        const girls = sortedConcurenti.filter(
            concurent => concurent.gender === 'F'
        );

        const boys = sortedConcurenti.filter(
            concurent => concurent.gender === 'M'
        );

        setConcurenti([
            ...girls,
            ...boys,
        ]);
    };

    const handleSelect = (concurent) => {

        if (!isEpisodeOpen) {
            return;
        }

        setSelectedIds((prev) => {

            if (prev.includes(concurent.id)) {

                setMessage('');

                return prev.filter(
                    (id) => id !== concurent.id
                );

            }

            if (prev.length >= 3) {

                toast.error(
                    'Poți selecta maxim 3 concurenți.'
                );

                return prev;

            }

            setMessage('');

            return [
                ...prev,
                concurent.id,
            ];

        });

    };

    const handleSubmitVotes = async () => {
        if (!profile) {
            toast.error(
                'Your profile is still being created.'
            );
            return;
        }
        if (!selectedEpisode) {
            toast.error(
                'Nu există un episod activ.'
            );
            return;
        }
        const {
            data,
            error,
        } = await hasUserVoted(
            user.id,
            selectedEpisode.id
        );

        if (error) {

            console.error(error);

            return;

        }

        if (data.length > 0) {

            toast.error(
                'Ai votat deja pentru acest episod.'
            );

            return;

        }

        const votes = selectedIds.map(
            (concurentId) => ({
                user_id: user.id,
                episode_id: selectedEpisode.id,
                concurent_id: concurentId,
            })
        );

        const {
            error: insertError,
        } = await submitVotes(votes);

        if (insertError) {

            console.error(insertError);

            setMessage(
                insertError.message
            );

            return;

        }

        setSelectedIds([]);

        toast.success(
            'Voturile au fost înregistrate cu succes!'
        );

    };



    if (loading || !profile) {
        return (
            <MainLayout>
                <section className="vote-loading">
                    <div className="loading-logo">
                        <img
                            src="/assets/iconIIpredict.png"
                            alt="Loading"
                        />
                    </div>
                    <h2>
                        Preparing your account...
                    </h2>
                    <p>
                        Please wait while we finish
                        creating your profile.
                    </p>
                </section>
            </MainLayout>
        );
    }
    return (
        <MainLayout>
            <UpcomingEpisodeBanner
                episodes={episodes}
            />
            <EpisodeSelector
                episodes={episodes}
                selectedEpisode={selectedEpisode}
                onSelect={handleEpisodeSelect}
                selectable
            />
            <div className="vote-page">
                <p className="vote-info">
                    Maxim 3 concurenți pot fi selectați (
                    {selectedIds.length} / 3)
                </p>
                <h1>Cine credeți că va aprinde flacăra ispitei?
                </h1>
                {message && (
                    <p className="vote-message">
                        {message}
                    </p>
                )}
                {concurenti.length === 0 ? (

                    <p className="empty-state">
                        Nu există concurenți activi.
                    </p>
                ) : (
                    <div className="contestants-grid">
                        {concurenti.map((concurent) => (
                            <ContestantCard
                                key={concurent.id}
                                concurent={concurent}
                                selected={
                                    isEpisodeOpen
                                        ? selectedIds.includes(concurent.id)
                                        : previousVoteIds.includes(concurent.id)
                                }
                                disabled={!isEpisodeOpen}
                                onSelect={handleSelect}
                            />
                        ))}
                    </div>
                )}
                <Button
                    type="button"
                    fullWidth
                    disabled={
                        !isEpisodeOpen ||
                        selectedIds.length === 0 ||
                        !selectedEpisode
                    }
                    onClick={handleSubmitVotes}
                >
                    Votează!
                </Button>
            </div>
        </MainLayout>

    );

}

export default Vote;