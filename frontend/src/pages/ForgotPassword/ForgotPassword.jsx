import { useState } from 'react';
import { Link } from 'react-router-dom';

import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import AuthLayout from '../../components/auth/AuthLayout/AuthLayout';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

import './ForgotPassword.scss';

function ForgotPassword() {

    const { resetPassword } = useAuth();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');
        setSuccess('');

        if (!email.trim()) {
            setError('Adaugă emailul!');
            return;
        }

        try {

            setLoading(true);

            const { error } = await resetPassword(
                email.trim()
            );

            if (error) {
                setError(error.message);
                return;
            }

            setSuccess(
                'Ți-am trimis un link pentru resetarea parolei.'
            );

        } catch (err) {

            setError(
                err.message || 'Something went wrong.'
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout
            title="Ai uitat parola?"
            subtitle="Introdu emailul contului tău."
        >

            <form
                className="forgot-password-form"
                onSubmit={handleSubmit}
            >

                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {error && (
                    <p className="forgot-password-error">
                        {error}
                    </p>
                )}

                {success && (
                    <p className="forgot-password-success">
                        {success}
                    </p>
                )}

                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                >
                    {loading
                        ? 'Se trimite...'
                        : 'Trimite linkul'}
                </Button>

            </form>

            <p className="forgot-password-footer">
                <Link to={ROUTES.LOGIN}>
                    Revino la pagina de logare.
                </Link>
            </p>

        </AuthLayout>

    );
}

export default ForgotPassword;