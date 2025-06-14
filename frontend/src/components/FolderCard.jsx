// frontend/src/components/FolderCard.jsx
import { useState } from "react";
import { FolderIcon, Trash2Icon, Edit3Icon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";

const FolderCard = ({ folder, setFolders }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/folder/${folder._id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/folders/${folder._id}`);
      setFolders((prev) => prev.filter((f) => f._id !== folder._id));
      toast.success("Folder deleted successfully");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete folder");
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
        to={`/folder/${folder._id}`}
        className="card bg-base-100 hover:shadow-lg transition-all duration-200 
        border-t-4 border-solid"
        style={{ borderTopColor: folder.color }}
      >
        <div className="card-body">
          <div className="flex items-center gap-3 mb-2">
            <FolderIcon 
              className="size-6 flex-shrink-0" 
              style={{ color: folder.color }}
            />
            <h3 className="card-title text-base-content truncate">{folder.name}</h3>
          </div>
          
          {folder.description && (
            <p className="text-base-content/70 text-sm line-clamp-2">
              {folder.description}
            </p>
          )}
          
          <div className="card-actions justify-between items-center mt-4">
            <span className="text-sm text-base-content/60">
              {folder.noteCount || 0} notes
            </span>
            <div className="flex items-center gap-1">
              <button
                className="btn btn-ghost btn-xs"
                onClick={handleEditClick}
              >
                <Edit3Icon className="size-4" />
              </button>
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
        title="Delete Folder"
        message={`Are you sure you want to delete "${folder.name}"? All notes in this folder will be moved to "No Folder".`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};

export default FolderCard;