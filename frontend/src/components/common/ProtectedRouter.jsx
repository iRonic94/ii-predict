import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return children;
}

export default ProtectedRoute;