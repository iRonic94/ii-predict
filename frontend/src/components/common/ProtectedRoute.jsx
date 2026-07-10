import { Navigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

function ProtectedRoute({
    children,
    requireAdmin = false,
}) {
    const {
        user,
        profile,
        loading,
    } = useAuth();

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (requireAdmin && profile?.role !== 'admin') {
        return <Navigate to={ROUTES.VOTE} replace />;
    }

    return children;
}

export default ProtectedRoute;