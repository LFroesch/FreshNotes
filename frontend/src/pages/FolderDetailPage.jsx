// frontend/src/pages/FolderDetailPage.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, FolderIcon, PlusIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";

const FolderDetailPage = () => {
  const [folder, setFolder] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchFolderData = async () => {
      try {
        const res = await api.get(`/folders/${id}`);
        setFolder(res.data.folder);
        setNotes(res.data.notes);
        setNotFound(false);
      } catch (error) {
        console.log("Error in fetching folder", error);
        if (error.response?.status === 404) {
          setNotFound(true);
        } else {
          toast.error("Failed to fetch the folder");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFolderData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <LoaderIcon className="animate-spin size-10" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="max-w-md mx-auto text-center px-4 py-20">
          <div className="bg-base-100 rounded-xl p-8 shadow-lg">
            <div className="flex justify-center mb-6">
              <div className="bg-error/10 p-4 rounded-full">
                <FolderIcon className="size-12 text-error" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-error mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Folder Not Found</h2>
            <p className="text-base-content/70 mb-6">
              The folder you're looking for doesn't exist or you don't have permission to view it.
            </p>
            
            <Link to="/" className="btn btn-primary">
              <ArrowLeftIcon className="size-4" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Home
            </Link>
            <Link 
              to={`/create?folderId=${folder._id}`} 
              className="btn btn-primary"
            >
              <PlusIcon className="h-5 w-5" />
              Add Note
            </Link>
          </div>

          {/* Folder Info */}
          <div className="card bg-base-100 mb-8 border-t-4" style={{ borderTopColor: folder.color }}>
            <div className="card-body">
              <div className="flex items-start gap-4">
                <FolderIcon 
                  className="size-8 flex-shrink-0 mt-1" 
                  style={{ color: folder.color }}
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{folder.name}</h1>
                  {folder.description && (
                    <p className="text-base-content/70 mb-4">{folder.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-base-content/60">
                    <span>{notes.length} notes</span>
                    <span>Created {new Date(folder.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <Link 
                  to={`/folder/${folder._id}/edit`} 
                  className="btn btn-ghost btn-sm"
                >
                  Edit Folder
                </Link>
              </div>
            </div>
          </div>

          {/* Notes Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Notes in this folder ({notes.length})
            </h2>
            
            {notes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <NoteCard key={note._id} note={note} setNotes={setNotes} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-base-100 rounded-xl p-8 max-w-md mx-auto">
                  <FolderIcon 
                    className="size-16 mx-auto mb-4" 
                    style={{ color: folder.color + '60' }}
                  />
                  <h3 className="text-xl font-semibold mb-2">No notes in this folder</h3>
                  <p className="text-base-content/70 mb-4">
                    Start adding notes to organize your thoughts in "{folder.name}"
                  </p>
                  <Link 
                    to={`/create?folderId=${folder._id}`} 
                    className="btn btn-primary"
                  >
                    <PlusIcon className="size-4" />
                    Create First Note
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderDetailPage;