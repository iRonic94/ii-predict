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
        (episode) =>
            episode.opens_at &&
            new Date(episode.opens_at) > now
    );

    if (!nextEpisode) {
        return null;
    }

    const diff =
        new Date(nextEpisode.opens_at).getTime() - now.getTime();

    const totalSeconds = Math.max(0, Math.floor(diff / 1000));

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds) % 86400 / 3600);

    let timer;

    if (days >= 1) {
        timer = `${days} ${days === 1 ? 'zi' : 'zile'} și ${hours} ${hours === 1 ? 'o ora' : 'ore'}`;
    } else {
        hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        timer =
            `${String(hours).padStart(2, '0')}:` +
            `${String(minutes).padStart(2, '0')}:` +
            `${String(seconds).padStart(2, '0')}`;
    }

    return (
        <section className="upcoming-banner">
            <h3 className="upcoming-title">
                EP.{nextEpisode.episode_number} se deschide în{' '}
                <span className="upcoming-timer">
                    {timer}
                </span>
            </h3>
        </section>
    );
}

export default UpcomingEpisodeBanner;