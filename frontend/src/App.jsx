import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import {
    getCurrentUser
} from "./api";

function App() {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const checkSession = async () => {

            try {

                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);

            } catch (error) {

                console.log(
                    "No active session"
                );

                setUser(null);

            } finally {

                setLoading(false);
            }
        };

        checkSession();

    }, []);


    if (loading) {

        return (
            <div className="loading">
                Checking session...
            </div>
        );
    }


    return (

        <BrowserRouter>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/login"
                    element={
                        user
                            ? <Navigate
                                to="/dashboard"
                                replace
                            />
                            : (
                                <Login
                                    onLoginSuccess={
                                        setUser
                                    }
                                    onRegisterClick={() => {
                                        window.location.href =
                                            "/register";
                                    }}
                                />
                            )
                    }
                />


                {/* REGISTER */}

                <Route
                    path="/register"
                    element={
                        user
                            ? <Navigate
                                to="/dashboard"
                                replace
                            />
                            : <Register 
                            onLoginClick={() => {
                                        window.location.href =
                                            "/login";
                                    }} />
                    }
                />


                {/* DASHBOARD */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute user={user}>
                            <Dashboard
                                user={user}
                                onLogout={() => {
                                    setUser(null);
                                }}
                            />
                        </ProtectedRoute>
                    }
                />


                {/* DEFAULT */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={
                                user
                                    ? "/dashboard"
                                    : "/login"
                            }
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;