import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '../../components/ui/Card/Card';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

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

    return (
        <div className="login-page">
            <Card title="Welcome back">
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
                        label="Password"
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export default Login;