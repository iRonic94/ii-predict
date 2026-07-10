import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import AuthLayout from '../../components/auth/AuthLayout/AuthLayout';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

import './Register.scss';

function Register() {
    const navigate = useNavigate();

    const { register } = useAuth();

    const [formData, setFormData] = useState({
        nickname: '',
        email: '',
        password: '',
        confirmPassword: '',
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

        if (
            !formData.nickname.trim() ||
            !formData.email.trim() ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError('Please complete all fields.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setLoading(true);

            const { error } = await register({
                nickname: formData.nickname.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            if (error) {
                setError(error.message);
                return;
            }

            navigate(ROUTES.LOGIN);

        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Creaza cont"
            subtitle="Sumset is back!"
        >

            <form
                className="register-form"
                onSubmit={handleSubmit}
            >

                <Input
                    label="Nickname"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                />

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

                <Input
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                {error && (
                    <p className="register-error">
                        {error}
                    </p>
                )}

                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                >
                    {loading
                        ? 'Se creaza contul...'
                        : 'Creaza-ți contul'}
                </Button>

            </form>

            <p className="register-footer">
                Daca ai cont nu te mai chinui
                <Link to={ROUTES.LOGIN}>
                    Dăi sign up aici!
                </Link>
            </p>

        </AuthLayout>
    );
}

export default Register;