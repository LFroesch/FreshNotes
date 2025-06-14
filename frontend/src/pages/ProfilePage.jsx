// frontend/src/pages/ProfilePage.jsx
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authUser";
import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { Edit3, Calendar, FileText, FolderIcon } from "lucide-react";
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
    const [folders, setFolders] = useState([]);

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
        const fetchData = async () => {
            try {
                const [notesRes, foldersRes] = await Promise.all([
                    axios.get("/api/notes"),
                    axios.get("/api/folders")
                ]);
                setNotes(notesRes.data);
                setFolders(foldersRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        if (user) fetchData();
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
                            <div className="w-24 h-24 rounded-full bg-primary/20 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-6xl font-bold text-primary select-none -translate-y-0.5">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
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
                                <div className="flex items-center gap-1">
                                    <FolderIcon size={16} />
                                    <span>{folders.length} folders</span>
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

                {/* My Recent Notes Preview */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">My Recent Notes</h2>
                        {notes.length > 6 && (
                            <Link to="/" className="btn btn-outline btn-sm">
                                View All Notes
                            </Link>
                        )}
                    </div>
                    {notes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {notes.slice(0, 6).map((note) => (
                                <Link 
                                    key={note._id} 
                                    to={`/note/${note._id}`}
                                    className="card bg-base-100 border-t-4 border-primary hover:shadow-lg transition-all duration-200 cursor-pointer"
                                >
                                    <div className="card-body">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h4 className="card-title text-sm flex-1">{note.title}</h4>
                                            <span className={`badge badge-sm ${
                                                note.priority === 'high' ? 'badge-error' :
                                                note.priority === 'medium' ? 'badge-warning' : 'badge-success'
                                            }`}>
                                                {note.priority}
                                            </span>
                                        </div>
                                        <p className="text-xs text-base-content/70 line-clamp-2">{note.content}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-xs text-base-content/50">
                                                {formatDate(note.createdAt)}
                                            </div>
                                            {note.folderId && (
                                                <div className="flex items-center gap-1 text-xs text-base-content/50">
                                                    <FolderIcon className="size-3" />
                                                    <span>{note.folderId.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-base-content/70 mb-4">
                                No notes yet. Start creating some notes!
                            </p>
                            <Link to="/create" className="btn btn-primary">
                                Create Your First Note
                            </Link>
                        </div>
                    )}
                </div>

                {/* My Folders Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">My Folders</h2>
                        {folders.length > 6 && (
                            <Link to="/" className="btn btn-outline btn-sm">
                                View All Folders
                            </Link>
                        )}
                    </div>
                    {folders.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {folders.slice(0, 6).map((folder) => (
                                <Link 
                                    key={folder._id} 
                                    to={`/folder/${folder._id}`}
                                    className="card bg-base-100 border-t-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
                                    style={{ borderTopColor: folder.color }}
                                >
                                    <div className="card-body">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FolderIcon 
                                                className="size-5 flex-shrink-0" 
                                                style={{ color: folder.color }}
                                            />
                                            <h4 className="card-title text-sm truncate">{folder.name}</h4>
                                        </div>
                                        {folder.description && (
                                            <p className="text-xs text-base-content/70 line-clamp-2">
                                                {folder.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="text-xs text-base-content/50">
                                                {folder.noteCount || 0} notes
                                            </div>
                                            <div className="text-xs text-base-content/50">
                                                {formatDate(folder.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-base-content/70 mb-4">
                                No folders yet. Create folders to organize your notes!
                            </p>
                            <Link to="/folder/create" className="btn btn-secondary">
                                Create Your First Folder
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;