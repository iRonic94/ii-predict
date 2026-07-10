import RankingRow from '../RankingRow/RankingRow';

import './RankingList.scss';

function RankingList({ users }) {
    return (
        <div className="ranking-list">

            {users.map((user, index) => (
                <RankingRow
                    key={user.id}
                    user={user}
                    position={index + 4}
                />
            ))}

        </div>
    );
}

export default RankingList;