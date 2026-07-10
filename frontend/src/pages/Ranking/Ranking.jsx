import { useEffect, useState } from 'react';

import MainLayout from '../../components/layout/MainLayout/MainLayout';

import Podium from '../../components/ranking/Podium/Podium';
import RankingList from '../../components/ranking/RankingList/RankingList';

import { getRanking } from '../../services/profileService';

import './Ranking.scss';

function Ranking() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRanking();
    }, []);

    const loadRanking = async () => {

        const { data, error } = await getRanking();

        if (error) {
            console.error(error);
            return;
        }

        setUsers(data);
        setLoading(false);

    };

    const topThree = users.slice(0, 3);
    const others = users.slice(3);

    return (
        <MainLayout>

            <div className="ranking-page">

                <h1>Ranking</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <Podium users={topThree} />

                        <RankingList users={others} />
                    </>
                )}

            </div>

        </MainLayout>
    );
}

export default Ranking;