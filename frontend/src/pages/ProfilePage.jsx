import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authUser";
import Navbar from "../components/Navbar";
import { Edit3, Calendar, FileText } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function formatDate(dateString) {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    return `${month} ${day}, ${year}`;
}

const ProfilePage = () => {
    const { user, authCheck } = useAuthStore();
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        username: "",
        email: "",
        bio: ""
    });
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        if (user) {
            setProfileData({
                username: user.username || "",
                email: user.email || "",
                bio: user.bio || ""
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await axios.get("/api/notes");
                setNotes(res.data);
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };
        if (user) fetchNotes();
    }, [user]);

    const handleProfileSave = async () => {
        setLoading(true);
        try {
            await axios.put('/api/profile/update', profileData);
            await authCheck(); // Refresh user data
            setEditingProfile(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-base-200">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* User Profile Section */}
                <div className="bg-base-100 rounded-xl p-8 border-t-4 border-primary shadow-lg mb-8">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="avatar">
                            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary">
                                    {user.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <h1 className="text-3xl font-bold">{user.username}</h1>
                                <button
                                    onClick={() => setEditingProfile(!editingProfile)}
                                    className="btn btn-ghost btn-sm"
                                >
                                    <Edit3 size={16} />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-base-content/60 mb-4">
                                <div className="flex items-center gap-1">
                                    <Calendar size={16} />
                                    <span>Joined {formatDate(user.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FileText size={16} />
                                    <span>{notes.length} notes</span>
                                </div>
                            </div>

                            {/* Profile Edit Form */}
                            {editingProfile ? (
                                <div className="space-y-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Username</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={profileData.username}
                                            onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                                            className="input input-bordered"
                                            placeholder="Username"
                                        />
                                    </div>
                                    
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                            className="input input-bordered"
                                            placeholder="Email"
                                        />
                                    </div>
                                    
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Bio</span>
                                        </label>
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                                            className="textarea textarea-bordered resize-none"
                                            rows="3"
                                            maxLength="500"
                                            placeholder="Tell others about yourself..."
                                        />
                                        <div className="label">
                                            <span className="label-text-alt">{profileData.bio.length}/500</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleProfileSave}
                                            disabled={loading}
                                            className="btn btn-primary"
                                        >
                                            {loading ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingProfile(false);
                                                setProfileData({
                                                    username: user.username || "",
                                                    email: user.email || "",
                                                    bio: user.bio || ""
                                                });
                                            }}
                                            className="btn btn-ghost"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-base-content/70 mb-2">
                                        <strong>Email:</strong> {user.email}
                                    </p>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Bio</h3>
                                        <p className="text-base-content/70 leading-relaxed">
                                            {user.bio || "No bio yet. Click the edit icon to add one!"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* My Notes Preview */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">My Recent Notes</h2>
                    {notes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {notes.slice(0, 6).map((note) => (
                                <div key={note._id} className="card bg-base-100 border-t-4 border-primary">
                                    <div className="card-body">
                                        <h4 className="card-title text-sm">{note.title}</h4>
                                        <p className="text-xs text-base-content/70 line-clamp-2">{note.content}</p>
                                        <div className="text-xs text-base-content/50 mt-2">
                                            {formatDate(note.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-base-content/70 text-center py-8">
                            No notes yet. Start creating some notes!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;