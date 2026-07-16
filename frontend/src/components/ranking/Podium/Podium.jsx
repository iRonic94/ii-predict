import { useState } from 'react';
import { FaCrown, FaMedal } from 'react-icons/fa';

import './Podium.scss';

function Podium({ users }) {
    const [imageError, setImageError] = useState({});
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
                            {(!second.avatar_url || imageError[second.id]) &&
                                getInitial(second.nickname)}
                            {second.avatar_url && !imageError[second.id] && (
                                <img
                                    src={second.avatar_url}
                                    alt={second.nickname}
                                    className="podium-avatar-image"
                                    onError={() =>
                                        setImageError(prev => ({
                                            ...prev,
                                            [second.id]: true
                                        }))
                                    }
                                />
                            )}
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
                            {(!first.avatar_url || imageError[first.id]) &&
                                getInitial(first.nickname)}
                            {first.avatar_url && !imageError[first.id] && (
                                <img
                                    src={first.avatar_url}
                                    alt={first.nickname}
                                    className="podium-avatar-image"
                                    onError={() =>
                                        setImageError(prev => ({
                                            ...prev,
                                            [first.id]: true
                                        }))
                                    }
                                />
                            )}
                            <div className="podium-rank gold">
                                <FaMedal />
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
                            {(!third.avatar_url || imageError[third.id]) &&
                                getInitial(third.nickname)}
                            {third.avatar_url && !imageError[third.id] && (
                                <img
                                    src={third.avatar_url}
                                    alt={third.nickname}
                                    className="podium-avatar-image"
                                    onError={() =>
                                        setImageError(prev => ({
                                            ...prev,
                                            [third.id]: true
                                        }))
                                    }
                                />
                            )}
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