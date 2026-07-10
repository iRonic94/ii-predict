import { NavLink, useNavigate } from 'react-router-dom';

import './Navbar.scss';

import { useAuth } from '../../../hooks/useAuth';

import { ROUTES } from '../../../constants/routes';

function Navbar() {
    const navigate = useNavigate();

    const {
        profile,
        logout,
    } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate(ROUTES.LOGIN);
    };

    return (
        <header className="navbar">

            <div
                className="navbar-logo"
                onClick={() => navigate(ROUTES.VOTE)}
            >
                II Predict
            </div>

            <nav className="navbar-nav">

                <NavLink
                    to={ROUTES.VOTE}
                    className={({ isActive }) =>
                        isActive
                            ? 'navbar-link active'
                            : 'navbar-link'
                    }
                >
                    Vote
                </NavLink>

                <NavLink
                    to={ROUTES.RANKING}
                    className={({ isActive }) =>
                        isActive
                            ? 'navbar-link active'
                            : 'navbar-link'
                    }
                >
                    Ranking
                </NavLink>

                {profile?.role === 'admin' && (
                    <NavLink
                        to={ROUTES.ADMIN}
                        className={({ isActive }) =>
                            isActive
                                ? 'navbar-link active'
                                : 'navbar-link'
                        }
                    >
                        Admin
                    </NavLink>
                )}

            </nav>

            <div className="navbar-user">

                <span className="navbar-name">
                    👤 {profile?.nickname}
                </span>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </header>
    );
}

export default Navbar;