import { useEffect, useState } from 'react';

import MainLayout from '../../components/layout/MainLayout/MainLayout';
import ContestantCard from '../../components/vote/ContestantCard/ContestantCard';
import EpisodeSelector from '../../components/vote/EpisodeSelector/EpisodeSelector';
import Button from '../../components/ui/Button/Button';

import { useAuth } from '../../hooks/useAuth';

import { getConcurentiActivi } from '../../services/concurentiService';
import { getAllEpisodes } from '../../services/episodeService';
import { hasUserVoted, submitVotes } from '../../services/voteService';

import './Vote.scss';

function Vote() {
    const { user } = useAuth();

    const [episodes, setEpisodes] = useState([]);
    const [selectedEpisode, setSelectedEpisode] = useState(null);

    const [concurenti, setConcurenti] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

    const [message, setMessage] = useState('');

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

    const loadConcurenti = async () => {

        const { data, error } = await getConcurentiActivi();

        if (error) {
            console.error(error);
            return;
        }

        setConcurenti(data);

    };

    const handleSelect = (concurent) => {

        setSelectedIds((prev) => {

            if (prev.includes(concurent.id)) {
                setMessage('');

                return prev.filter((id) => id !== concurent.id);
            }

            if (prev.length >= 3) {
                setMessage('Poți selecta doar 3 concurenți.');
                return prev;
            }

            setMessage('');

            return [...prev, concurent.id];

        });

    };

    const handleSubmitVotes = async () => {

        if (!selectedEpisode) {
            setMessage('Nu există un episod activ.');
            return;
        }

        const { data, error } = await hasUserVoted(
            user.id,
            selectedEpisode.id
        );

        if (error) {
            console.error(error);
            return;
        }

        if (data.length > 0) {
            setMessage('Ai votat deja pentru acest episod.');
            return;
        }

        const votes = selectedIds.map((concurentId) => ({
            user_id: user.id,
            episode_id: selectedEpisode.id,
            concurent_id: concurentId,
        }));

        const { error: insertError } = await submitVotes(votes);

        if (insertError) {
            console.error(insertError);
            setMessage(insertError.message);
            return;
        }

        setSelectedIds([]);
        setMessage('Voturile au fost înregistrate cu succes!');

    };

    return (
        <MainLayout>

            <EpisodeSelector
                episodes={episodes}
                activeEpisode={selectedEpisode}
                onSelect={setSelectedEpisode}
            />

            <div className="vote-page">

                <p className="vote-info">
                    Selected {selectedIds.length} / 3 contestants
                </p>

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
                                selected={selectedIds.includes(concurent.id)}
                                onSelect={handleSelect}
                            />
                        ))}

                    </div>
                )}

                <Button
                    type="button"
                    fullWidth
                    disabled={
                        selectedIds.length !== 3 ||
                        !selectedEpisode
                    }
                    onClick={handleSubmitVotes}
                >
                    Submit Votes
                </Button>

            </div>

        </MainLayout>
    );
}

export default Vote;