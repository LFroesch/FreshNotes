// frontend/src/pages/CreatePage.jsx
import { ArrowLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router";
import api from "../lib/axios";
import EnhancedTextEditor from "../components/EnhancedTextEditor";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("medium");
  const [color, setColor] = useState("#00FF9D");
  const [folderId, setFolderId] = useState("");
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFolders, setLoadingFolders] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Predefined colors for notes
  const predefinedColors = [
    "#00FF9D", // Primary green
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#96CEB4", // Light green
    "#FECA57", // Yellow
    "#FF9FF3", // Pink
    "#54A0FF", // Light blue
    "#5F27CD", // Purple
    "#00D2D3", // Cyan
    "#FF9F43", // Orange
    "#10AC84", // Green
  ];

  // Fetch folders on component mount
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await api.get("/folders");
        setFolders(res.data);
        
        // Set folder from URL parameter if present
        const folderIdFromUrl = searchParams.get('folderId');
        if (folderIdFromUrl) {
          setFolderId(folderIdFromUrl);
        }
      } catch (error) {
        console.log("Error fetching folders", error);
        toast.error("Failed to load folders");
      } finally {
        setLoadingFolders(false);
      }
    };

    fetchFolders();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", {
        title,
        content,
        priority,
        color, // Add color to the request
        folderId: folderId || null,
      });

      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response?.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Priority</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Folder</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={folderId}
                      onChange={(e) => setFolderId(e.target.value)}
                      disabled={loadingFolders}
                    >
                      <option value="">No Folder</option>
                      {folders.map((folder) => (
                        <option key={folder._id} value={folder._id}>
                          {folder.name}
                        </option>
                      ))}
                    </select>
                    {loadingFolders && (
                      <div className="label">
                        <span className="label-text-alt">Loading folders...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Note Color Picker */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Note Color</span>
                  </label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {predefinedColors.map((colorOption) => (
                      <button
                        key={colorOption}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          color === colorOption 
                            ? 'border-base-content scale-110' 
                            : 'border-base-300 hover:border-base-content'
                        }`}
                        style={{ backgroundColor: colorOption }}
                        onClick={() => setColor(colorOption)}
                        title={colorOption}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    className="input input-bordered w-full h-12"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content *</span>
                  </label>
                  <EnhancedTextEditor
                    value={content}
                    onChange={setContent}
                    placeholder="Write your note here... You can use markdown formatting!"
                  />
                </div>

                <div className="card-actions justify-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;