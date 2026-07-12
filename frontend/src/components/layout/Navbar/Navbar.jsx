import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Image, LogOut } from 'lucide-react';

import avatarPlaceholder from '../../../assets/ph_avatar.png';
import './Navbar.scss';
import logo from '../../../assets/iconIIpredict.png'

import { useAuth } from '../../../hooks/useAuth';

import { ROUTES } from '../../../constants/routes';

function Navbar() {
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {

        const handleClickOutside = (e) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
            }

        };

        document.addEventListener(
            'mousedown',
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                'mousedown',
                handleClickOutside
            );

    }, []);

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

            <div
                className="navbar-user"
                ref={dropdownRef}>
                <button
                    className="navbar-user-trigger"
                    onClick={() => setOpen((prev) => !prev)}>
                    <img
                        src={profile?.avatar_url || avatarPlaceholder}
                        alt={profile?.nickname}
                        className="navbar-avatar"
                    />

                    <span className="navbar-name">
                        {profile?.nickname}
                    </span>
                    <ChevronDown
                        size={18}
                        className={`navbar-chevron ${open ? 'open' : ''
                            }`}
                    />
                </button>
                {open && (
                    <div className="profile-dropdown">
                        <button className="dropdown-item">
                            <Image size={18} />
                            Schimbă poza
                        </button>
                        <button
                            className="dropdown-item logout"
                            onClick={handleLogout}>
                            <LogOut size={18} />
                            Ieși afar'
                        </button>

                    </div>

                )}

            </div>

        </header>
    );
}

export default Navbar;