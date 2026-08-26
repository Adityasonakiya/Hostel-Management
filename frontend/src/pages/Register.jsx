import { useState } from "react";
import { registerUser } from "../api";

function Register({ onLoginClick }) {

    const [form, setForm] = useState({
        name: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            await registerUser(form);

            setMessage("Registration successful! You can now login.");

            setForm({
                name: "",
                password: ""
            });

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="auth-container">

            <div className="auth-card">

                <h1>🏨 Hostel Management</h1>

                <h2>Create Account</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Username"
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
                        Register
                    </button>

                </form>

                {message && (
                    <p className="success">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                <p className="switch-text">
                    Already have an account?

                    <button
                        className="link-button"
                        onClick={onLoginClick}
                    >
                        Login
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Register;