import { useEffect, useState } from 'react';

import MainLayout from '../../components/layout/MainLayout/MainLayout';
import ContestantCard from '../../components/vote/ContestantCard/ContestantCard';
import Button from '../../components/ui/Button/Button';

import { getConcurentiActivi } from '../../services/concurentiService';

import './Vote.scss';

function Vote() {
    const [concurenti, setConcurenti] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadConcurenti = async () => {
            const { data, error } = await getConcurentiActivi();

            if (error) {
                console.error(error);
                return;
            }

            setConcurenti(data);
        };

        loadConcurenti();
    }, []);

    const handleSelect = (concurent) => {
        setSelectedIds((prev) => {

            if (prev.includes(concurent.id)) {
                setMessage('');
                return prev.filter((id) => id !== concurent.id);
            }

            if (prev.length >= 3) {
                setMessage('You can only select 3 contestants.');
                return prev;
            }

            setMessage('');

            return [...prev, concurent.id];
        });
    };

    const handleSubmitVotes = () => {
        console.log(selectedIds);

        // aici va veni voteService.submitVotes()
    };

    return (
        <MainLayout>

            <div className="vote-page">

                <h1>Vote</h1>

                <p className="vote-info">
                    Selected {selectedIds.length} / 3 contestants
                </p>

                {message && (
                    <p className="vote-message">
                        {message}
                    </p>
                )}

                {concurenti.length === 0 ? (
                    <p className="empty-state">
                        No active contestants available.
                    </p>
                ) : (
                    <div className="contestants-grid">

                        {concurenti.map((concurent) => (
                            <ContestantCard
                                key={concurent.id}
                                concurent={concurent}
                                selected={selectedIds.includes(concurent.id)}
                                onSelect={handleSelect}
                            />
                        ))}

                    </div>
                )}

                <Button
                    type="button"
                    fullWidth
                    disabled={selectedIds.length !== 3}
                    onClick={handleSubmitVotes}
                >
                    Submit Votes
                </Button>

            </div>

        </MainLayout>
    );
}

export default Vote;