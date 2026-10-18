import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import './ContestantCard.scss';

function ContestantCard({
    concurent,
    selected = false,
    onSelect,
    disabled = false,
    eliminated = false,
}) {
    const [extension, setExtension] = useState('jpg');

    const imagePath = `${concurent.name_id}.${extension}`;

    const { data } = supabase.storage
        .from('cupluri')
        .getPublicUrl(imagePath);

    const imageUrl = data?.publicUrl;

    return (
        <article
            className={`contestant-card ${selected ? 'selected' : ''
                } ${disabled ? 'disabled' : ''
                }`}
            onClick={() => {
                if (!disabled) {
                    onSelect?.(concurent);
                }
            }}
        >
            <div className="contestant-card-image">
                <img
                    src={imageUrl}
                    alt={concurent.name}
                    onError={(event) => {
                        if (extension === 'jpg') {
                            setExtension('png');
                        } else {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src =
                                'https://placehold.co/500x700?text=No+Image';
                        }
                    }}
                />
                {eliminated && (
                    <div className="eliminated-overlay">
                        <span>ELIMINAT</span>
                    </div>
                )}
                {selected && (
                    <div className="selected-overlay">
                        <div className="selected-circle">
                            ✓
                        </div>
                    </div>
                )}
            </div>

            <div className="contestant-card-content">
                <h3>{concurent.name}</h3>

                <button
                    type="button"
                    className="contestant-button"
                    disabled={disabled}
                >
                    {selected ? 'Selectat' : 'Selectează'}
                </button>
            </div>
        </article>
    );
}

export default ContestantCard;