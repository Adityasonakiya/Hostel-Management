import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api";

function Navbar({ user, onLogout }) {

    const navigate = useNavigate();

    const handleLogout = async () => {

        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {

            onLogout();

            navigate("/login", {
                replace: true
            });
        }
    };

    return (
        <nav className="navbar">

            <div className="navbar-brand">
                🏨 Hostel Management
            </div>

            <div className="navbar-right">

                <span>
                    Welcome, {user?.name}
                </span>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;