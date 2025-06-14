// frontend/src/pages/NoteDetailPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon, FileX, EditIcon, EyeIcon, SaveIcon, XIcon, FolderIcon } from "lucide-react";
import ConfirmationModal from "../components/ConfirmationModal";
import EnhancedTextEditor from "../components/EnhancedTextEditor";
import { formatDate } from "../lib/utils";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [originalNote, setOriginalNote] = useState(null); // Store original for cancel functionality
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [noteRes, foldersRes] = await Promise.all([
          api.get(`/notes/${id}`),
          api.get("/folders")
        ]);
        
        setNote(noteRes.data);
        setOriginalNote(noteRes.data); // Store original copy
        setFolders(foldersRes.data);
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

    fetchData();
  }, [id]);

  // Simple markdown to HTML converter for display
  const renderMarkdown = (text) => {
    if (!text) return '';
    
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3 text-base-content">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3 text-base-content">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-base-content">$1</h1>')
      
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      
      // Code
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-base-300 rounded p-4 my-4 overflow-x-auto"><code class="text-sm font-mono">$1</code></pre>')
      .replace(/`(.*?)`/gim, '<code class="bg-base-300 px-2 py-1 rounded text-sm font-mono">$1</code>')
      
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary underline hover:text-primary-focus" target="_blank" rel="noopener">$1</a>')
      
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary/30 pl-4 my-4 text-base-content/80 italic">$1</blockquote>')
      
      // Lists
      .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc list-inside my-1">$1</li>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc list-inside my-1">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal list-inside my-1">$1</li>')
      
      // Line breaks
      .replace(/\n/gim, '<br>');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-base-content/60';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'badge-error',
      medium: 'badge-warning',
      low: 'badge-success'
    };
    
    return (
      <span className={`badge ${colors[priority] || 'badge-ghost'}`}>
        {priority}
      </span>
    );
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setNote(originalNote); // Restore original values
    setIsEditMode(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      
      const fromFolder = searchParams.get('from');
      if (fromFolder) {
        navigate(`/folder/${fromFolder}`);
      } else {
        navigate("/");
      }
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
      toast.error("Please add a title and content");
      return;
    }

    setSaving(true);

    try {
      const updateData = {
        title: note.title,
        content: note.content,
        priority: note.priority,
        color: note.color, // Add color to update data
        folderId: note.folderId?._id || null
      };

      const response = await api.put(`/notes/${id}`, updateData);
      setNote(response.data);
      setOriginalNote(response.data); // Update original with saved data
      setIsEditMode(false);
      
      toast.success("Note updated successfully");
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

  return (
    <>
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Link 
                to={searchParams.get('from') ? `/folder/${searchParams.get('from')}` : "/"} 
                className="btn btn-ghost"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Back
              </Link>
              
              {!isEditMode && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleEditClick}
                    className="btn btn-primary btn-outline"
                  >
                    <EditIcon className="h-5 w-5" />
                    Edit
                  </button>
                  <button 
                    onClick={handleDeleteClick} 
                    className="btn btn-error btn-outline hover:btn-error"
                  >
                    <Trash2Icon className="h-5 w-5" />
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Note Content */}
            <div 
              className="card bg-base-100 border-l-4"
              style={{ borderLeftColor: note?.color || '#00FF9D' }}
            >
              <div className="card-body">
                {!isEditMode ? (
                  /* VIEW MODE */
                  <>
                    {/* Note Header */}
                    <div className="mb-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-3xl font-bold text-base-content flex-1">
                          {note.title}
                        </h1>
                        {getPriorityBadge(note.priority)}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/60">
                        <span>Created {formatDate(new Date(note.createdAt))}</span>
                        {note.updatedAt !== note.createdAt && (
                          <span>• Updated {formatDate(new Date(note.updatedAt))}</span>
                        )}
                        {note.folderId && (
                          <span className="flex items-center gap-1">
                            • <FolderIcon className="size-4" />
                            {note.folderId.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Note Content */}
                    <div className="divider"></div>
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(note.content) }}
                    />
                  </>
                ) : (
                  /* EDIT MODE */
                  <>
                    <div className="form-control mb-4">
                      <label className="label">
                        <span className="label-text">Title *</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Note title"
                        className="input input-bordered"
                        value={note.title}
                        onChange={(e) => setNote({ ...note, title: e.target.value })}
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
                          value={note.priority}
                          onChange={(e) => setNote({ ...note, priority: e.target.value })}
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
                          value={note.folderId?._id || ""}
                          onChange={(e) => {
                            const selectedFolderId = e.target.value;
                            if (selectedFolderId) {
                              const selectedFolder = folders.find(f => f._id === selectedFolderId);
                              setNote({ 
                                ...note, 
                                folderId: selectedFolder
                              });
                            } else {
                              setNote({ 
                                ...note, 
                                folderId: null 
                              });
                            }
                          }}
                        >
                          <option value="">No Folder</option>
                          {folders.map((folder) => (
                            <option key={folder._id} value={folder._id}>
                              {folder.name}
                            </option>
                          ))}
                        </select>
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
                              note.color === colorOption 
                                ? 'border-base-content scale-110' 
                                : 'border-base-300 hover:border-base-content'
                            }`}
                            style={{ backgroundColor: colorOption }}
                            onClick={() => setNote({ ...note, color: colorOption })}
                            title={colorOption}
                          />
                        ))}
                      </div>
                      <input
                        type="color"
                        className="input input-bordered w-full h-12"
                        value={note.color || "#00FF9D"}
                        onChange={(e) => setNote({ ...note, color: e.target.value })}
                      />
                    </div>

                    <div className="form-control mb-6">
                      <label className="label">
                        <span className="label-text">Content *</span>
                      </label>
                      <EnhancedTextEditor
                        value={note.content}
                        onChange={(content) => setNote({ ...note, content })}
                        placeholder="Write your note here... You can use markdown formatting!"
                      />
                    </div>

                    {/* Action Buttons for Edit Mode */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-base-300">
                      <button 
                        onClick={handleCancelEdit}
                        className="btn btn-error btn-outline hover:btn-error"
                      >
                        <XIcon className="h-5 w-5" />
                        Cancel
                      </button>
                      <button 
                        className="btn btn-primary" 
                        disabled={saving} 
                        onClick={handleSave}
                      >
                        <SaveIcon className="h-5 w-5" />
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </>
                )}
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