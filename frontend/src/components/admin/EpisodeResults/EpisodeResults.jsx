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
    const [validateEpisodeSwitch, setValidateEpisodeSwitch] = useState(false);

    useEffect(() => {

        setSelectedIds([]);
        setValidateEpisodeSwitch(
            episode?.validated ?? false
        );

    }, [episode]);

    const handleSelect = (concurent) => {

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

        const {
            error: deleteError,
        } = await clearEpisodeResults(
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

        const {
            error: insertError,
        } = await saveEpisodeResults(results);

        if (insertError) {
            console.error(insertError);
            return;
        }

        const {
            error: validateError,
        } = await validateEpisode(
            episode.id,
            validateEpisodeSwitch
        );

        if (validateError) {
            console.error(validateError);
            return;
        }

        const {
            error: pointsError,
        } = await calculateEpisodePoints(
            episode.id
        );

        if (pointsError) {
            console.error(pointsError);
            return;
        }

        onValidated();

        alert(
            validateEpisodeSwitch
                ? 'Episode validated successfully.'
                : 'Results saved successfully.'
        );

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

            <div className="validate-switch">

                <label className="switch">

                    <input
                        type="checkbox"
                        checked={validateEpisodeSwitch}
                        onChange={(e) =>
                            setValidateEpisodeSwitch(
                                e.target.checked
                            )
                        }
                    />

                    <span className="slider"></span>

                </label>

                <span className="switch-label">
                    Validate episode
                </span>

            </div>

            <Button
                type="button"
                fullWidth
                disabled={selectedIds.length === 0}
                onClick={handleValidate}
            >
                {validateEpisodeSwitch
                    ? 'Validate Episode'
                    : 'Save Results'}
            </Button>

        </section>

    );

}

export default EpisodeResults;