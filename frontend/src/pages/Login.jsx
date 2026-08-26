import { useState } from "react";
import {loginUser, getCurrentUser} from "../api";

function Login({ onLoginSuccess, onRegisterClick }) {

    const [form, setForm] = useState({
        name: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await loginUser(form);
            const user = await getCurrentUser();
            onLoginSuccess(user);

        } catch (err) {
            setError(
                "Invalid username or password"
            );
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>🏨 Hostel Management</h1>

                <h2>Welcome Back</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="username"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                </form>

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <p className="switch-text">

                    Don't have an account?

                    <button
                        className="link-button"
                        onClick={onRegisterClick}
                    >
                        Register
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Login;