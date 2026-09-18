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

    // Episodul care este în desfășurare acum
    const activeEpisode = episodes.find((episode) => {

        if (!episode.opens_at || !episode.closes_at) {
            return false;
        }

        const opensAt = new Date(episode.opens_at);
        const closesAt = new Date(episode.closes_at);

        return now >= opensAt && now <= closesAt;

    });

    // Următorul episod care urmează să se deschidă
    const nextEpisode = episodes.find(
        (episode) =>
            episode.opens_at &&
            new Date(episode.opens_at) > now
    );

    let targetDate;
    let message;
    let episodeNumber;

    if (activeEpisode) {

        targetDate = new Date(activeEpisode.closes_at);
        message = `EP.${activeEpisode.episode_number} se închide în`;
        episodeNumber = activeEpisode.episode_number;

    } else if (nextEpisode) {

        targetDate = new Date(nextEpisode.opens_at);
        message = `EP.${nextEpisode.episode_number} se deschide în`;
        episodeNumber = nextEpisode.episode_number;

    } else {

        return null;

    }

    const diff =
        targetDate.getTime() - now.getTime();

    const totalSeconds = Math.max(
        0,
        Math.floor(diff / 1000)
    );

    const days = Math.floor(totalSeconds / 86400);

    let timer;

    if (days >= 1) {

        const hours = Math.floor(
            (totalSeconds % 86400) / 3600
        );

        timer =
            `${days} ${days === 1 ? 'zi' : 'zile'}` +
            (hours > 0
                ? ` și ${hours} ${hours === 1 ? 'oră' : 'ore'}`
                : '');

    } else {

        const hours = Math.floor(
            totalSeconds / 3600
        );

        const minutes = Math.floor(
            (totalSeconds % 3600) / 60
        );

        const seconds = totalSeconds % 60;

        timer =
            `${String(hours).padStart(2, '0')}:` +
            `${String(minutes).padStart(2, '0')}:` +
            `${String(seconds).padStart(2, '0')}`;
    }

    return (
        <section className="upcoming-banner">

            <h3 className="upcoming-title">

                {message}{' '}

                <span className="upcoming-timer">
                    {timer}
                </span>

            </h3>

        </section>
    );
}

export default UpcomingEpisodeBanner;