// frontend/src/pages/CreateFolderPage.jsx
import { ArrowLeftIcon, FolderIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";

const CreateFolderPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#00FF9D");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Folder name is required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/folders", {
        name: name.trim(),
        description: description.trim(),
        color,
      });

      toast.success("Folder created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating folder", error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Folder name already exists");
      } else if (error.response?.status === 429) {
        toast.error("Slow down! You're creating folders too fast");
      } else {
        toast.error("Failed to create folder");
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
            Back to Home
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4 flex items-center gap-2">
                <FolderIcon className="size-6" />
                Create New Folder
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Folder Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Work Notes, Personal, Ideas"
                    className="input input-bordered"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    required
                  />
                  <div className="label">
                    <span className="label-text-alt">{name.length}/100</span>
                  </div>
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Description (Optional)</span>
                  </label>
                  <textarea
                    placeholder="Brief description of what this folder contains..."
                    className="textarea textarea-bordered h-20"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                  />
                  <div className="label">
                    <span className="label-text-alt">{description.length}/500</span>
                  </div>
                </div>

                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text">Folder Color</span>
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

                {/* Preview */}
                <div className="mb-6">
                  <label className="label">
                    <span className="label-text">Preview</span>
                  </label>
                  <div className="card bg-base-200 border-t-4" style={{ borderTopColor: color }}>
                    <div className="card-body py-4">
                      <div className="flex items-center gap-3">
                        <FolderIcon className="size-6" style={{ color }} />
                        <div>
                          <h3 className="font-semibold">
                            {name || "Folder Name"}
                          </h3>
                          {description && (
                            <p className="text-sm text-base-content/70">
                              {description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-actions justify-end">
                  <Link to="/" className="btn btn-ghost">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-secondary" disabled={loading}>
                    {loading ? "Creating..." : "Create Folder"}
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

export default CreateFolderPage;