import { useNow } from '../../../hooks/useNow'

import './EpisodeSelector.scss';

function EpisodeSelector({
    episodes,
    selectedEpisode,
    onSelect,
    selectable = false,
    allowAdmin = false,
}) {

    const now = useNow();

    const getStatus = (episode) => {

        if (!episode.opens_at || !episode.closes_at) {
            return 'locked';
        }

        const opensAt = new Date(episode.opens_at);
        const closesAt = new Date(episode.closes_at);

        if (now < opensAt) {
            return 'locked';
        }

        if (now > closesAt) {
            return 'closed';
        }

        return 'active';
    };

    return (
        <div className="episode-selector">

            {episodes.map((episode) => {

                const status = getStatus(episode);

                const isSelected =
                    selectedEpisode?.id === episode.id;

                return (
                    <button
                        key={episode.id}
                        type="button"
                        className={`
                            episode-card
                            ${status}
                            ${isSelected ? 'selected' : ''}
                             ${allowAdmin ? 'admin-panel' : ''}
                        `}
                        onClick={() => {
                            if (selectable && onSelect) {
                                onSelect(episode);
                            }
                        }}
                        disabled={
                            !selectable ||
                            (!allowAdmin && status !== 'active' && status !== 'closed')
                        }
                    >
                        <span className="episode-title">
                            {episode.title}
                        </span>

                        <span className="episode-status">
                            {status === 'active' && '🟢 Votează'}
                            {status === 'locked' && '🔒 Blocat'}
                            {status === 'closed' && '✔ Încheiat'}
                        </span>

                    </button>
                );

            })}

        </div>
    );
}

export default EpisodeSelector;