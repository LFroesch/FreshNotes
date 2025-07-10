// frontend/src/pages/HomePage.jsx
import React from 'react'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import RateLimitedUI from '../components/RateLimitedUI'
import toast from 'react-hot-toast'
import api from '../lib/axios'
import NotesNotFound from '../components/NotesNotFound'
import NoteCard from '../components/NoteCard'
import FolderCard from '../components/FolderCard'
import { FolderIcon, FileTextIcon } from 'lucide-react'

const HomePage = () => {
    const [isRateLimited, setIsRateLimited] = useState(false)
    const [notes, setNotes] = useState([])
    const [folders, setFolders] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('folders') // 'folders' or 'notes'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [foldersRes, notesRes] = await Promise.all([
                    api.get("/folders"),
                    api.get("/notes?folderId=null")
                ]);
                
                setFolders(foldersRes.data);
                setNotes(notesRes.data);
                setIsRateLimited(false);
            } catch (error) {
                console.log("Error fetching data", error);
                if (error.response?.status === 429) {
                    setIsRateLimited(true);
                } else {
                    toast.error("Failed to load data");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const hasContent = folders.length > 0 || notes.length > 0;

    return (
        <div className="min-h-screen">
            <Navbar />

            {isRateLimited && <RateLimitedUI />}

            <div className="max-w-7xl mx-auto p-4 mt-6">
                {loading && <div className="text-center text-primary py-10">Loading...</div>}

                {!hasContent && !isRateLimited && !loading && <NotesNotFound />}

                {hasContent && !isRateLimited && (
                    <>
                        {/* Tab Navigation */}
                        <div className="tabs tabs-boxed mb-6 w-fit">
                            <button 
                                className={`tab gap-2 ${activeTab === 'folders' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('folders')}
                            >
                                <FolderIcon className="size-4" />
                                Folders ({folders.length})
                            </button>
                            <button 
                                className={`tab gap-2 ${activeTab === 'notes' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('notes')}
                            >
                                <FileTextIcon className="size-4" />
                                Loose Notes ({notes.length})
                            </button>
                        </div>

                        {/* Folders Tab */}
                        {activeTab === 'folders' && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Your Folders</h2>
                                {folders.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {folders.map((folder) => (
                                            <FolderCard key={folder._id} folder={folder} setFolders={setFolders} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <FolderIcon className="size-16 text-base-content/30 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">No folders yet</h3>
                                        <p className="text-base-content/70 mb-4">
                                            Create folders to organize your notes better
                                        </p>
                                        <a href="/folder/create" className="btn btn-secondary">
                                            Create Your First Folder
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Notes Tab */}
                        {activeTab === 'notes' && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Notes Not in Folders</h2>
                                {notes.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {notes.map((note) => (
                                            <NoteCard key={note._id} note={note} setNotes={setNotes} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <FileTextIcon className="size-16 text-base-content/30 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">No loose notes</h3>
                                        <p className="text-base-content/70 mb-4">
                                            All your notes are organized in folders, or you haven't created any notes yet
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
export default HomePage