import { NavLink, useNavigate } from 'react-router-dom';

import './Navbar.scss';
import logo from '../../../assets/iconIIpredict.png'

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

                <img
                    src={logo}
                    alt="Insula Predicției"
                    className="navbar-logo-icon"
                />

                <span className="navbar-logo-text">
                    Insula Predicției
                </span>

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
                    Votează
                </NavLink>

                <NavLink
                    to={ROUTES.RANKING}
                    className={({ isActive }) =>
                        isActive
                            ? 'navbar-link active'
                            : 'navbar-link'
                    }
                >
                    Clasament
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
                    Ieși afar'
                </button>

            </div>

        </header>
    );
}

export default Navbar;