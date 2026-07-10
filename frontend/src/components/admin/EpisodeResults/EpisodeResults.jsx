import { useEffect, useState } from 'react';

import ContestantCard from '../../vote/ContestantCard/ContestantCard';
import Button from '../../ui/Button/Button';

import {
    clearEpisodeResults,
    saveEpisodeResults,
    validateEpisode,
    calculateEpisodePoints,
} from '../../../services/adminService';

import './EpisodeResults.scss';

function EpisodeResults({
    episode,
    concurenti,
    onValidated,
}) {

    const [selectedIds, setSelectedIds] = useState([]);

    useEffect(() => {
        setSelectedIds([]);
    }, [episode]);

    const handleSelect = (concurent) => {

        if (episode.validated) {
            return;
        }

        setSelectedIds((prev) => {

            if (prev.includes(concurent.id)) {
                return prev.filter((id) => id !== concurent.id);
            }

            return [...prev, concurent.id];

        });

    };

    const handleValidate = async () => {

        if (!episode) {
            return;
        }

        if (episode.validated) {
            alert('Episode already validated.');
            return;
        }

        const { error: deleteError } =
            await clearEpisodeResults(
                episode.id
            );

        if (deleteError) {
            console.error(deleteError);
            return;
        }

        const results = selectedIds.map((concurentId) => ({
            episode_id: episode.id,
            concurent_id: concurentId,
        }));

        const { error: insertError } =
            await saveEpisodeResults(results);

        if (insertError) {
            console.error(insertError);
            return;
        }

        const { error: validateError } =
            await validateEpisode(
                episode.id
            );

        if (validateError) {
            console.error(validateError);
            return;
        }

        const { error: pointsError } =
            await calculateEpisodePoints(
                episode.id
            );

        if (pointsError) {
            console.error(pointsError);
            return;
        }

        onValidated();

        alert('Episode validated successfully.');

    };

    return (

        <section className="episode-results">

            <h2>Episode Results</h2>

            <p className="results-info">
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
                    episode.validated ||
                    selectedIds.length === 0
                }
                onClick={handleValidate}
            >
                {episode.validated
                    ? 'Already Validated'
                    : 'Validate Episode'}
            </Button>

        </section>

    );

}

export default EpisodeResults;