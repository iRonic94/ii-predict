import { supabase } from '../../../lib/supabase';
import './ContestantCard.scss';

function ContestantCard({
    concurent,
    selected = false,
    onSelect,
    disabled,
}) {
    const imagePath = `${concurent.name_id}.webp`;

    const { data } = supabase.storage
        .from('cupluri')
        .getPublicUrl(imagePath);

    const imageUrl = data?.publicUrl;
    return (
        <article
            className={`contestant-card ${selected ? 'selected' : ''
                } ${disabled ? 'disabled' : ''
                }`}
            onClick={() => onSelect(concurent)}
        >

            <div className="contestant-card-image">
                <img
                    src={imageUrl || 'https://placehold.co/500x700?text=No+Image'}
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
