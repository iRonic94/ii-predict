import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import AuthLayout from '../../components/auth/AuthLayout/AuthLayout';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

import './ResetPassword.scss';

function ResetPassword() {

    const navigate = useNavigate();

    const {
        updatePassword,
        logout,
    } = useAuth();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');

        if (!password || !confirmPassword) {
            setError('Completează toate câmpurile!');
            return;
        }

        if (password !== confirmPassword) {
            setError('Parolele nu se potrivesc.');
            return;
        }

        if (password.length < 6) {
            setError('Parola trebuie sa aibă minim 6 caractere.');
            return;
        }

        try {

            setLoading(true);

            const { error } = await updatePassword(password);

            if (error) {
                setError(error.message);
                return;
            }

            setSuccess(
                'Ai resetat parola!'
            );

            setTimeout(async () => {

                await logout();

                navigate(ROUTES.LOGIN);

            }, 1000);

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
            title="Resetează parola"
            subtitle="Alege o parolă nouă pentru contul tău."
        >

            <form
                className="reset-password-form"
                onSubmit={handleSubmit}
            >

                <Input
                    label="Parolă nouă"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Input
                    label="Confirmare parolă"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                {error && (
                    <p className="reset-password-error">
                        {'Parola trebuie sa fie diferită de cea veche!'}
                    </p>
                )}

                {success && (
                    <p className="reset-password-success">
                        {'Parola a fost schimbată!'}
                    </p>
                )}

                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                >
                    {loading
                        ? 'Se actualizează...'
                        : 'Schimbă parola'}
                </Button>

            </form>

        </AuthLayout>

    );
}

export default ResetPassword;