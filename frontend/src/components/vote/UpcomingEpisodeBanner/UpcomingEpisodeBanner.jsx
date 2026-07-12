import { useEffect, useState } from 'react';

import './UpcomingEpisodeBanner.scss';

function UpcomingEpisodeBanner({ episodes }) {

    const [now, setNow] = useState(new Date());

    useEffect(() => {

        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);

    }, []);

    const nextEpisode = episodes.find(
        (episode) => new Date(episode.opens_at) > now
    );

    if (!nextEpisode) {
        return null;
    }

    const diff =
        new Date(nextEpisode.opens_at).getTime() - now.getTime();

    const totalSeconds = Math.floor(diff / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const timer =
        `${String(hours).padStart(2, '0')}:` +
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}`;

    return (
        <section className="upcoming-banner">

            <h3 className="upcoming-title">
                EP.{nextEpisode.episode_number} se deschide in <span class="upcoming-timer">{timer}</span>

            </h3>


        </section>
    );

}

export default UpcomingEpisodeBanner;