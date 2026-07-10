import { useEffect, useState } from 'react';

import Button from '../../ui/Button/Button';

import { updateEpisodeDates } from '../../../services/episodeService';

import './EpisodeSchedule.scss';

function EpisodeSchedule({
    episode,
    onUpdated,
}) {

    const [opensAt, setOpensAt] = useState('');
    const [closesAt, setClosesAt] = useState('');

    useEffect(() => {

        if (!episode) {
            return;
        }

        setOpensAt(
            episode.opens_at
                ? episode.opens_at.slice(0, 16)
                : ''
        );

        setClosesAt(
            episode.closes_at
                ? episode.closes_at.slice(0, 16)
                : ''
        );

    }, [episode]);

    const handleSave = async () => {

        const { error } = await updateEpisodeDates(
            episode.id,
            opensAt,
            closesAt
        );

        if (error) {
            console.error(error);
            return;
        }

        onUpdated();

        alert('Episode schedule updated.');

    };

    return (

        <section className="episode-schedule">

            <h2>Episode Schedule</h2>

            <div className="schedule-grid">

                <div className="schedule-field">

                    <label>
                        Opens At
                    </label>

                    <input
                        type="datetime-local"
                        value={opensAt}
                        onChange={(e) =>
                            setOpensAt(e.target.value)
                        }
                    />

                </div>

                <div className="schedule-field">

                    <label>
                        Closes At
                    </label>

                    <input
                        type="datetime-local"
                        value={closesAt}
                        onChange={(e) =>
                            setClosesAt(e.target.value)
                        }
                    />

                </div>

            </div>

            <Button
                type="button"
                onClick={handleSave}
            >
                Save Schedule
            </Button>

        </section>

    );

}

export default EpisodeSchedule;