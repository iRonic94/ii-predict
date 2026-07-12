import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import AuthLayout from '../../components/auth/AuthLayout/AuthLayout';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

import { signInWithGoogle } from '../../services/authService';

import './Login.scss';

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');

        if (!formData.email.trim() || !formData.password) {
            setError('Please complete all fields.');
            return;
        }

        try {

            setLoading(true);

            const { error } = await login(
                formData.email.trim(),
                formData.password
            );

            if (error) {
                setError(error.message);
                return;
            }

            navigate(ROUTES.VOTE);

        } finally {

            setLoading(false);

        }

    };

    const handleGoogleLogin = async () => {

        const { error } = await signInWithGoogle();

        if (error) {
            setError(error.message);
        }

    };

    return (

        <AuthLayout title="Logare👹👇">
            <form
                className="login-form"
                onSubmit={handleSubmit}
            >
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <Input
                    label="Parolă"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}

                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                >
                    {loading ? 'Te loghez imediat...' : 'Loghează-te'}
                </Button>

            </form>

            <div className="login-divider">
                <span>sau</span>
            </div>

            <button
                type="button"
                className="google-button"
                onClick={handleGoogleLogin}
            >
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                />
                Continuă cu Google
            </button>

            <p className="login-footer">
                N-ai încă cont?
                <Link to={ROUTES.REGISTER}>
                    Dă click/tap aici!
                </Link>

            </p>

        </AuthLayout>

    );

}

export default Login;