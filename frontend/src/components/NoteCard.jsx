// frontend/src/components/NoteCard.jsx
import { useState } from "react";
import { PenSquareIcon, Trash2Icon, FolderIcon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";

const NoteCard = ({ note, setNotes }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/notes/${note._id}`);
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete note");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const stripMarkdown = (text) => {
    return text
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '[code block]') // Replace code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/^>\s+/gm, '') // Remove blockquotes
      .replace(/^[-*+]\s+/gm, '') // Remove list markers
      .replace(/^\d+\.\s+/gm, '') // Remove numbered list markers
      .trim();
    
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
      <span className={`badge badge-sm ${colors[priority] || 'badge-ghost'}`}>
        {priority}
      </span>
    );
  };

  return (
    <>
      <Link
        to={`/note/${note._id}`}
        className="card bg-base-100 hover:shadow-lg transition-all duration-200 
        border-t-4 border-solid border-[#00FF9D]"
      >
        <div className="card-body">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="card-title text-base-content flex-1">{note.title}</h3>
            {getPriorityBadge(note.priority)}
          </div>
          
          <p className="text-base-content/70 line-clamp-3">{stripMarkdown(note.content)}</p>
          
          <div className="card-actions justify-between items-center mt-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-base-content/60">
                {formatDate(new Date(note.createdAt))}
              </span>
              {note.folderId && (
                <div className="flex items-center gap-1 text-xs text-base-content/50">
                  <FolderIcon className="size-3" />
                  <span>{note.folderId.name}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <PenSquareIcon className="size-4" />
              <button
                className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                onClick={handleDeleteClick}
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Note"
        message={`Are you sure you want to delete "${note.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default NoteCard;