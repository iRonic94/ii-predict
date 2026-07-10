import './ContestantCard.scss';

function ContestantCard({
    concurent,
    selected = false,
    onSelect,
}) {

    return (
        <article
            className={`contestant-card ${selected ? 'selected' : ''}`}
            onClick={() => onSelect(concurent)}
        >

            <div className="contestant-card-image">

                <img
                    src={
                        concurent.image_url ||
                        'https://placehold.co/400x500?text=No+Image'
                    }
                    alt={concurent.name}
                />

            </div>

            <div className="contestant-card-content">

                <h3>
                    {concurent.name}
                </h3>

                <button
                    type="button"
                    className="contestant-card-button"
                >
                    {selected ? 'Selected' : 'Select'}
                </button>

            </div>

        </article>
    );
}

export default ContestantCard;