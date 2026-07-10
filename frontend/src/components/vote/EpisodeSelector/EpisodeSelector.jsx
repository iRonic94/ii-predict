import './EpisodeSelector.scss';

function EpisodeSelector({
    episodes,
    selectedEpisode,
    onSelect,
    selectable = false,
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
                        `}
                        onClick={() => {
                            if (selectable && onSelect) {
                                onSelect(episode);
                            }
                        }}
                        disabled={!selectable && status !== 'active'}
                    >
                        <span className="episode-title">
                            {episode.title}
                        </span>

                        <span className="episode-status">

                            {status === 'active' && '🟢 Votează'}

                            {status === 'locked' && '🔒 Blocat'}

                            {status === 'closed' && '✔ Inchis'}

                        </span>

                    </button>
                );

            })}

        </div>
    );
}

export default EpisodeSelector;