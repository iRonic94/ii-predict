import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Vote from '../pages/Vote/Vote';
import Ranking from '../pages/Ranking/Ranking';
import Admin from '../pages/Admin/Admin';

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route
                    path="/vote"
                    element={
                        <ProtectedRoute>
                            <Vote />
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
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;