import './ContestantCard.scss';

function ContestantCard({
    concurent,
    selected = false,
    onSelect,
    disabled,
}) {
    return (
        <article
            className={`contestant-card ${selected ? 'selected' : ''
                } ${disabled ? 'disabled' : ''
                }`}
            onClick={() => onSelect(concurent)}
        >

            <div className="contestant-card-image">

                <img
                    src={
                        concurent.image_url ||
                        'https://placehold.co/500x700?text=No+Image'
                    }
                    alt={concurent.name}
                />

                {selected && (
                    <div className="selected-overlay">
                        <div className="selected-circle">
                            ✓
                        </div>
                    </div>
                )}

            </div>

            <div className="contestant-card-content">

                <h3>
                    {concurent.name}
                </h3>

                <button
                    type="button"
                    className="contestant-button"
                >
                    {selected ? 'Selectat' : 'Selectează'}
                </button>

            </div>

        </article>
    );
}

export default ContestantCard;