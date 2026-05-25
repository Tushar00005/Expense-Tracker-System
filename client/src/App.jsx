import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Expenses from './pages/Expenses.jsx';
import Analytics from './pages/Analytics.jsx';
import Layout from './components/Layout.jsx';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/" element={
                        <PrivateRoute>
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/expenses" element={
                        <PrivateRoute>
                            <Layout>
                                <Expenses />
                            </Layout>
                        </PrivateRoute>
                    } />
                    <Route path="/analytics" element={
                        <PrivateRoute>
                            <Layout>
                                <Analytics />
                            </Layout>
                        </PrivateRoute>
                    } />
                </Routes>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
