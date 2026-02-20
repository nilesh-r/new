import { Link, useLocation } from 'react-router-dom';
import { Home, List, Folder, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const links = [
        { path: '/dashboard', label: 'Dashboard', icon: Home },
        { path: '/projects', label: 'Projects', icon: Folder },
        { path: '/tasks', label: 'Tasks', icon: List },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-5 text-2xl font-bold border-b border-gray-700">
                TaskFlow
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {links.map(({ path, label, icon: Icon }) => (
                    <Link
                        key={path}
                        to={path}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${location.pathname === path
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <Icon size={20} />
                        <span>{label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-700">
                <div className="mb-4 px-3">
                    <p className="text-sm text-gray-400">Logged in as</p>
                    <p className="font-semibold">{user?.username || 'User'}</p>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
