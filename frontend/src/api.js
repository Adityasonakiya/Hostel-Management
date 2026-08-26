const API_BASE = "http://localhost:8080";

async function request(url, options = {}) {
    const response = await fetch(`${API_BASE}${url}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    if (!response.ok) {
        let message = "Something went wrong";

        try {
            const contentType = response.headers.get("content-type");

            if (contentType?.includes("application/json")) {
                const data = await response.json();
                message = data.message || data.error || message;
            } else {
                message = await response.text();
            }
        } catch {
            // Ignore parsing error
        }

        throw new Error(message);
    }

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
        return response.json();
    }

    return response.text();
}

export const registerUser = (data) =>
    request("/auth/register", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const loginUser = (data) =>
    request("/auth/login", {
        method: "POST",
        body: JSON.stringify(data)
    });

export const getRooms = () =>
    request("/api/rooms");

export const getTenants = () =>
    request("/api/tenants");

export const addTenant = (roomNumber, data) =>
    request(`/api/tenant/${roomNumber}`, {
        method: "POST",
        body: JSON.stringify(data)
    });


export const getCurrentUser = () =>
    request("/auth/me");

export const logoutUser = () =>
    request("/auth/logout", {
        method: "POST"
    });    