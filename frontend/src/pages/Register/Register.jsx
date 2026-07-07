import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '../../components/ui/Card/Card';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        const { error } = await register({
            nickname: formData.nickname,
            email: formData.email,
            password: formData.password,
        });

        if (error) {
            setError(error.message);
            return;
        }

        navigate(ROUTES.LOGIN);
    };

    return (
        <div className="register-page">
            <Card title="Create account">

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
                    >
                        Create account
                    </Button>

                </form>

            </Card>
        </div>
    );
}

export default Register;