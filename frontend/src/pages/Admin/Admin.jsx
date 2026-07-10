import { useEffect, useState } from 'react';

import MainLayout from '../../components/layout/MainLayout/MainLayout';
import EpisodeSelector from '../../components/vote/EpisodeSelector/EpisodeSelector';
import ContestantCard from '../../components/vote/ContestantCard/ContestantCard';
import Button from '../../components/ui/Button/Button';

import { getConcurentiActivi } from '../../services/concurentiService';
import { getAllEpisodes } from '../../services/episodeService';

import {
    saveEpisodeResults,
    clearEpisodeResults,
    validateEpisode,
    calculateEpisodePoints,
} from '../../services/adminService';

import './Admin.scss';

function Admin() {
    const [episodes, setEpisodes] = useState([]);
    const [selectedEpisode, setSelectedEpisode] = useState(null);

    const [concurenti, setConcurenti] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);

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

        if (data.length > 0) {
            setSelectedEpisode(data[0]);
        }
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
                return prev.filter((id) => id !== concurent.id);
            }

            return [...prev, concurent.id];
        });
    };

    const handleValidate = async () => {

        if (!selectedEpisode) {
            return;
        }

        if (selectedEpisode.validated) {
            alert('This episode has already been validated.');
            return;
        }

        // Șterge rezultatele existente
        const { error: deleteError } = await clearEpisodeResults(
            selectedEpisode.id
        );

        if (deleteError) {
            console.error(deleteError);
            return;
        }

        // Construiește rezultatele
        const results = selectedIds.map((concurentId) => ({
            episode_id: selectedEpisode.id,
            concurent_id: concurentId,
        }));

        // Salvează rezultatele
        const { error: insertError } = await saveEpisodeResults(results);

        if (insertError) {
            console.error(insertError);
            return;
        }

        // Marchează episodul ca validat
        const { error: validateError } = await validateEpisode(
            selectedEpisode.id
        );

        if (validateError) {
            console.error(validateError);
            return;
        }

        // Calculează punctele
        const { error: pointsError } = await calculateEpisodePoints(
            selectedEpisode.id
        );

        if (pointsError) {
            console.error(pointsError);
            return;
        }

        // Actualizează episodul local
        setEpisodes((prev) =>
            prev.map((episode) =>
                episode.id === selectedEpisode.id
                    ? { ...episode, validated: true }
                    : episode
            )
        );

        setSelectedEpisode((prev) => ({
            ...prev,
            validated: true,
        }));

        setSelectedIds([]);

        alert('Episode validated successfully!');
    };

    return (
        <MainLayout>

            <div className="admin-page">

                <h1>Admin Panel</h1>

                <EpisodeSelector
                    episodes={episodes}
                    selectedEpisode={selectedEpisode}
                    onSelect={(episode) => {
                        setSelectedEpisode(episode);
                        setSelectedIds([]);
                    }}
                />

                <p className="admin-info">
                    Selected: {selectedIds.length}
                </p>

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

                <Button
                    type="button"
                    fullWidth
                    disabled={
                        !selectedEpisode ||
                        selectedIds.length === 0 ||
                        selectedEpisode.validated
                    }
                    onClick={handleValidate}
                >
                    {selectedEpisode?.validated
                        ? 'Already Validated'
                        : 'Validate Episode'}
                </Button>

            </div>

        </MainLayout>
    );
}

export default Admin;