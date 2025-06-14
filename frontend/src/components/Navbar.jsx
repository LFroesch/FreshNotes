import { Link } from 'react-router'
import { PlusIcon, LogOut, User } from 'lucide-react'
import { useAuthStore } from '../store/authUser'

const Navbar = () => {
    const { logout } = useAuthStore();

    return (
        <header className='bg-base-300 border-b border-base-content/10'>
            <div className='mx-auto max-w-6xl p-4'>
                <div className='flex items-center justify-between'>
                    <Link to="/" className='text-3xl font-bold text-primary font-mono tracking-tight'>
                        FreshNotes
                    </Link>
                    <div className='flex items-center gap-4'>
                        <Link to={'/create'} className='btn btn-primary'>
                            <PlusIcon className='size-4' />
                        </Link>
                        <Link to="/profile" className="btn btn-ghost">
                            <User className="size-4" />
                        </Link>
                        <button onClick={logout} className="btn btn-ghost">
                            <LogOut className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar
