import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // 🔐 Only check token (same as Dashboard)
        if (!token) {
            navigate("/login");
            return;
        }

        // ✅ Read user safely
        let storedUser = localStorage.getItem("user");

        // If user does not exist, create minimal user once
        if (!storedUser) {
            const fallbackUser = {
                name: "",
                email: localStorage.getItem("loginEmail") || "",
            };
            localStorage.setItem("user", JSON.stringify(fallbackUser));
            storedUser = JSON.stringify(fallbackUser);
        }

        const parsedUser = JSON.parse(storedUser);
        setName(parsedUser.name || "");
        setEmail(parsedUser.email || "");

        setLoading(false);
    }, [navigate]);

    const handleUpdate = () => {
        const updatedUser = { name, email };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Profile updated successfully ✅");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500 text-lg">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-10">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {name ? name[0].toUpperCase() : "U"}
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-800">
                            My Profile
                        </h2>
                        <p className="text-sm text-slate-500">
                            Manage your account details
                        </p>
                    </div>
                </div>

                {/* Full Name */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                    />
                </div>

                {/* Email */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-4 py-3 border rounded-xl bg-slate-100 cursor-not-allowed"
                    />
                </div>

                {/* Update Button */}
                <button
                    onClick={handleUpdate}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition"
                >
                    Update Profile
                </button>
            </div>
        </div>
    );
}

export default Profile;
