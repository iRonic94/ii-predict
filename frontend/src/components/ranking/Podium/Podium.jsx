import { FaCrown, FaMedal } from 'react-icons/fa';

import './Podium.scss';

function Podium({ users }) {

    const first = users[0];
    const second = users[1];
    const third = users[2];

    const getInitial = (nickname) =>
        nickname?.charAt(0).toUpperCase() || '?';

    return (
        <div className="podium">

            {/* SECOND */}

            <div className="podium-item second">

                {second && (
                    <>
                        <div className="podium-avatar silver">
                            {getInitial(second.nickname)}

                            <div className="podium-rank silver">
                                <FaMedal />
                            </div>

                        </div>

                        <h3>{second.nickname}</h3>

                        <span>{second.total_points} pts</span>

                        <div className="podium-base silver">
                            2
                        </div>
                    </>
                )}

            </div>

            {/* FIRST */}

            <div className="podium-item first">

                {first && (
                    <>
                        <FaCrown className="podium-crown" />

                        <div className="podium-avatar gold">

                            {getInitial(first.nickname)}

                            <div className="podium-rank gold">
                                1
                            </div>

                        </div>

                        <h2>{first.nickname}</h2>

                        <span>{first.total_points} pts</span>

                        <div className="podium-base gold">
                            1
                        </div>
                    </>
                )}

            </div>

            {/* THIRD */}

            <div className="podium-item third">

                {third && (
                    <>
                        <div className="podium-avatar bronze">

                            {getInitial(third.nickname)}

                            <div className="podium-rank bronze">
                                <FaMedal />
                            </div>

                        </div>

                        <h3>{third.nickname}</h3>

                        <span>{third.total_points} pts</span>

                        <div className="podium-base bronze">
                            3
                        </div>
                    </>
                )}

            </div>

        </div>
    );
}

export default Podium;