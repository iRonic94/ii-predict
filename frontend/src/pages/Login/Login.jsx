import { useAuth } from '../../hooks/useAuth';

function Login() {

    const auth = useAuth();

    console.log(auth);

    return <h1>Login</h1>;
}

export default Login;