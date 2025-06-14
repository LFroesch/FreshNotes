import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import NoteDetailPage from './pages/NoteDetailPage';
import CreatePage from './pages/CreatePage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Footer from './components/Footer';
import { useAuthStore } from './store/authUser';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

const App = () => {
  const { user, isCheckingAuth, authCheck } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen">
        <div className="flex items-center justify-center h-full bg-base-200">
          <Loader className="animate-spin text-primary size-10"/>
        </div>
      </div>
    )
  }

  return (
    <div data-theme="forest" className="relative h-full w-full">
      <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/note/:id" element={user ? <NoteDetailPage /> : <Navigate to="/login" />} />
        <Route path="/create" element={user ? <CreatePage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App