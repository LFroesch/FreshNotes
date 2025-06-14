import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon, FileX } from "lucide-react";
import ConfirmationModal from "../components/ConfirmationModal"; // Adjust path as needed

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
        setNotFound(false);
      } catch (error) {
        console.log("Error in fetching note", error);
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error("Failed to fetch the note");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  // 404 Not Found Page
  if (notFound) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-base-100 rounded-xl p-8 shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="bg-error/10 p-4 rounded-full">
                <FileX className="size-12 text-error" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-error mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Note Not Found</h2>
            <p className="text-base-content/70 mb-6">
              The note you're looking for doesn't exist or you don't have permission to view it.
            </p>
            
            <div className="space-y-3">
              <Link to="/" className="btn btn-primary w-full">
                <ArrowLeftIcon className="size-4" />
                Return to Home
              </Link>
              <Link to="/create" className="btn btn-outline w-full">
                Create New Note
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular note editing page
  return (
    <>
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link to="/" className="btn btn-ghost">
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Notes
              </Link>
              <button 
                onClick={handleDeleteClick} 
                className="btn btn-error btn-outline hover:btn-error"
              >
                <Trash2Icon className="h-5 w-5" />
                Delete Note
              </button>
            </div>

            <div className="card bg-base-100">
              <div className="card-body">
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note title"
                    className="input input-bordered"
                    value={note.title}
                    onChange={(e) => setNote({ ...note, title: e.target.value })}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered h-32"
                    value={note.content}
                    onChange={(e) => setNote({ ...note, content: e.target.value })}
                  />
                </div>

                <div className="card-actions justify-end">
                  <button 
                    className="btn btn-primary" 
                    disabled={saving} 
                    onClick={handleSave}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Note"
        message={`Are you sure you want to delete "${note?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default NoteDetailPage;