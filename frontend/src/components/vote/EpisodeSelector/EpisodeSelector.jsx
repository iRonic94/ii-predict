import './EpisodeSelector.scss';

function EpisodeSelector({
    episodes,
    selectedEpisode,
    onSelect,
}) {
    const now = new Date();

    const getStatus = (episode) => {
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

                return (
                    <button
                        key={episode.id}
                        type="button"
                        className={`episode-card ${status} ${selectedEpisode?.id === episode.id ? 'selected' : ''
                            }`}
                        onClick={() => status === 'active' && onSelect(episode)}
                        disabled={status !== 'active'}
                    >

                        <span className="episode-title">
                            {episode.title}
                        </span>

                        <span className="episode-status">

                            {status === 'active' && '🟢 Open'}

                            {status === 'locked' && '🔒 Locked'}

                            {status === 'closed' && '✔ Closed'}

                        </span>

                    </button>
                );
            })}

        </div>
    );
}

export default EpisodeSelector;