import { useState } from "react";
import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal"; // Adjust path as needed

const NoteCard = ({ note, setNotes }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
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

  return (
    <>
      <Link
        to={`/note/${note._id}`}
        className="card bg-base-100 hover:shadow-lg transition-all duration-200 
        border-t-4 border-solid border-[#00FF9D]"
      >
        <div className="card-body">
          <h3 className="card-title text-base-content">{note.title}</h3>
          <p className="text-base-content/70 line-clamp-3">{note.content}</p>
          <div className="card-actions justify-between items-center mt-4">
            <span className="text-sm text-base-content/60">
              {formatDate(new Date(note.createdAt))}
            </span>
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