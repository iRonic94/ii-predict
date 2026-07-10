import './RankingRow.scss';

function RankingRow({ user, position }) {
    return (
        <div className="ranking-row">

            <span className="ranking-position">
                #{position}
            </span>

            <span className="ranking-name">
                {user.nickname}
            </span>

            <span className="ranking-points">
                {user.total_points} pts
            </span>

        </div>
    );
}

export default RankingRow;