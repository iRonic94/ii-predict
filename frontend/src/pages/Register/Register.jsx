import { useAuth } from '../../hooks/useAuth';

function Register() {
    const { register } = useAuth();

    console.log(register);

    return <h1>Register</h1>;
}

export default Register;