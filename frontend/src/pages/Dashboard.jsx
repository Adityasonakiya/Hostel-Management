import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
    getRooms,
    getTenants,
    addTenant
} from "../api";

function Dashboard({ user, onLogout }) {

    const [rooms, setRooms] = useState([]);
    const [tenants, setTenants] = useState([]);

    const [form, setForm] = useState({
        name: "",
        roomNumber: "",
        startDate: "",
        endDate: ""
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const loadData = async () => {

        try {

            setLoading(true);

            const [roomsData, tenantsData] =
                await Promise.all([
                    getRooms(),
                    getTenants()
                ]);

            setRooms(roomsData);
            setTenants(tenantsData);

        } catch (err) {

            console.error(err);

            setError(
                "Unable to load hostel data."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        loadData();
    }, []);


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!form.roomNumber) {
            setError("Please select a room.");
            return;
        }

        if (form.startDate >= form.endDate) {
            setError(
                "End date must be after start date."
            );
            return;
        }

        try {

            setSubmitting(true);

            await addTenant(
                form.roomNumber,
                {
                    name: form.name,
                    startDate: form.startDate,
                    endDate: form.endDate
                }
            );

            setSuccess(
                `${form.name} has been added successfully.`
            );

            setForm({
                name: "",
                roomNumber: "",
                startDate: "",
                endDate: ""
            });

            await loadData();

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to add tenant."
            );

        } finally {

            setSubmitting(false);
        }
    };


    const totalBeds = rooms.reduce(
        (sum, room) =>
            sum + room.totalBeds,
        0
    );

    const occupiedBeds = rooms.reduce(
        (sum, room) =>
            sum + room.occupiedBeds,
        0
    );

    const availableBeds =
        totalBeds - occupiedBeds;

    const occupancyPercentage =
        totalBeds === 0
            ? 0
            : Math.round(
                (occupiedBeds / totalBeds) * 100
            );


    if (loading) {

        return (
            <>
                <Navbar
                    user={user}
                    onLogout={onLogout}
                />

                <div className="page-loader">
                    <div className="spinner"></div>
                    <p>Loading hostel data...</p>
                </div>
            </>
        );
    }


    return (
        <div className="app">

            <Navbar
                user={user}
                onLogout={onLogout}
            />

            <main className="dashboard">

                {/* HEADER */}

                <div className="dashboard-header">

                    <div>
                        <h1>
                            Hostel Dashboard
                        </h1>

                        <p>
                            Manage rooms, occupancy
                            and tenants.
                        </p>
                    </div>

                    <div className="date-display">
                        {new Date().toLocaleDateString(
                            "en-IN",
                            {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            }
                        )}
                    </div>

                </div>


                {/* ROOM CARDS */}

                <section>

                    <div className="section-title">

                        <h2>
                            Room Overview
                        </h2>

                        <span>
                            4 Rooms · 16 Beds
                        </span>

                    </div>


                    <div className="room-grid">

                        {rooms.map(room => {

                            const available =
                                room.totalBeds -
                                room.occupiedBeds;

                            const full =
                                available === 0;

                            return (

                                <div
                                    className={`room-card ${
                                        full
                                            ? "room-full"
                                            : ""
                                    }`}
                                    key={room.id}
                                >

                                    <div className="room-card-top">

                                        <div>

                                            <span className="room-label">
                                                ROOM
                                            </span>

                                            <h3>
                                                {room.roomNumber}
                                            </h3>

                                        </div>

                                        <span
                                            className={`room-status ${
                                                full
                                                    ? "full"
                                                    : "available"
                                            }`}
                                        >
                                            {full
                                                ? "Full"
                                                : `${available} Available`}
                                        </span>

                                    </div>


                                    <div className="beds">

                                        {Array.from({
                                            length:
                                                room.totalBeds
                                        }).map(
                                            (_, index) => (

                                                <div
                                                    key={index}
                                                    className={`bed ${
                                                        index <
                                                        room.occupiedBeds
                                                            ? "occupied"
                                                            : "empty"
                                                    }`}
                                                >
                                                    {index <
                                                    room.occupiedBeds
                                                        ? "●"
                                                        : "○"}
                                                </div>

                                            )
                                        )}

                                    </div>


                                    <div className="occupancy">

                                        <span>
                                            {
                                                room.occupiedBeds
                                            } / {
                                                room.totalBeds
                                            } beds occupied
                                        </span>

                                        <div className="progress">

                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width:
                                                        `${
                                                            (
                                                                room.occupiedBeds /
                                                                room.totalBeds
                                                            ) *
                                                            100
                                                        }%`
                                                }}
                                            />

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </section>


                {/* MANAGEMENT AREA */}

                <div className="management-grid">


                    {/* ADD TENANT */}

                    <section className="panel">

                        <div className="panel-header">

                            <div>

                                <h2>
                                    Add Tenant
                                </h2>

                                <p>
                                    Assign a tenant to
                                    an available room.
                                </p>

                            </div>

                            <div className="panel-icon">
                                +
                            </div>

                        </div>


                        {error && (
                            <div className="alert error-alert">
                                {error}
                            </div>
                        )}


                        {success && (
                            <div className="alert success-alert">
                                {success}
                            </div>
                        )}


                        <form
                            onSubmit={handleSubmit}
                            className="tenant-form"
                        >

                            <div className="form-group">

                                <label>
                                    Tenant Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter tenant name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Room
                                </label>

                                <select
                                    name="roomNumber"
                                    value={form.roomNumber}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select room
                                    </option>

                                    {rooms
                                        .filter(
                                            room =>
                                                room.occupiedBeds <
                                                room.totalBeds
                                        )
                                        .map(room => (

                                            <option
                                                key={room.id}
                                                value={
                                                    room.roomNumber
                                                }
                                            >
                                                {
                                                    room.roomNumber
                                                }{" "}
                                                —{" "}
                                                {
                                                    room.totalBeds -
                                                    room.occupiedBeds
                                                }{" "}
                                                bed available
                                            </option>

                                        ))}

                                </select>

                            </div>


                            <div className="date-grid">

                                <div className="form-group">

                                    <label>
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        name="startDate"
                                        value={
                                            form.startDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        name="endDate"
                                        value={
                                            form.endDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="primary-button"
                                disabled={submitting}
                            >

                                {submitting
                                    ? "Adding Tenant..."
                                    : "Add Tenant"}

                            </button>

                        </form>

                    </section>


                    {/* SUMMARY */}

                    <section className="panel">

                        <div className="panel-header">

                            <div>

                                <h2>
                                    Hostel Summary
                                </h2>

                                <p>
                                    Current occupancy
                                    statistics.
                                </p>

                            </div>

                            <div className="panel-icon">
                                📊
                            </div>

                        </div>


                        <div className="stats">

                            <div className="stat">

                                <span>
                                    Total Beds
                                </span>

                                <strong>
                                    {totalBeds}
                                </strong>

                            </div>


                            <div className="stat">

                                <span>
                                    Occupied
                                </span>

                                <strong>
                                    {occupiedBeds}
                                </strong>

                            </div>


                            <div className="stat">

                                <span>
                                    Available
                                </span>

                                <strong>
                                    {availableBeds}
                                </strong>

                            </div>


                            <div className="stat">

                                <span>
                                    Occupancy
                                </span>

                                <strong>
                                    {occupancyPercentage}%
                                </strong>

                            </div>

                        </div>


                        <div className="overall-progress">

                            <div className="progress-header">

                                <span>
                                    Overall Occupancy
                                </span>

                                <strong>
                                    {occupancyPercentage}%
                                </strong>

                            </div>

                            <div className="progress">

                                <div
                                    className="progress-fill"
                                    style={{
                                        width:
                                            `${occupancyPercentage}%`
                                    }}
                                />

                            </div>

                        </div>

                    </section>

                </div>


                {/* TENANTS */}

                <section className="panel tenants-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Current Tenants
                            </h2>

                            <p>
                                All currently registered
                                hostel tenants.
                            </p>

                        </div>

                        <span className="tenant-count">
                            {tenants.length} Tenants
                        </span>

                    </div>


                    {tenants.length === 0 ? (

                        <div className="empty-state">

                            <div>
                                👤
                            </div>

                            <h3>
                                No tenants yet
                            </h3>

                            <p>
                                Add your first tenant
                                using the form above.
                            </p>

                        </div>

                    ) : (

                        <div className="tenant-table-wrapper">

                            <table className="tenant-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Tenant
                                        </th>

                                        <th>
                                            Room
                                        </th>

                                        <th>
                                            Start Date
                                        </th>

                                        <th>
                                            End Date
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {tenants.map(
                                        tenant => (

                                            <tr
                                                key={
                                                    tenant.id
                                                }
                                            >

                                                <td>

                                                    <div className="tenant-name">

                                                        <div className="avatar">
                                                            {
                                                                tenant.name
                                                                    ?.charAt(
                                                                        0
                                                                    )
                                                                    ?.toUpperCase()
                                                            }
                                                        </div>

                                                        <strong>
                                                            {
                                                                tenant.name
                                                            }
                                                        </strong>

                                                    </div>

                                                </td>


                                                <td>

                                                    <span className="room-badge">
                                                        {
                                                            tenant.room?.roomNumber ||
                                                            tenant.roomNumber ||
                                                            "-"
                                                        }
                                                    </span>

                                                </td>


                                                <td>
                                                    {
                                                        tenant.startDate
                                                    }
                                                </td>


                                                <td>
                                                    {
                                                        tenant.endDate
                                                    }
                                                </td>


                                                <td>

                                                    <span className="active-badge">
                                                        Active
                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default Dashboard;