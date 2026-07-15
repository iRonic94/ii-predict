import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from '../components/common/ProtectedRoute';

import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Vote from '../pages/Vote/Vote';
import Ranking from '../pages/Ranking/Ranking';
import Admin from '../pages/Admin/Admin';
import Profile from '../pages/Profile/Profile';

import { useAuth } from '../hooks/useAuth';

function AppRoutes() {

    const { user } = useAuth();

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={
                        <Navigate
                            to={user ? '/vote' : '/login'}
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/ranking"
                    element={<Ranking />}
                />

                <Route
                    path="/vote"
                    element={
                        <ProtectedRoute>
                            <Vote />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requireAdmin>
                            <Admin />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;