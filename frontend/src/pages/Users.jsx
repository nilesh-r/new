import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users as UsersIcon, Loader2, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Users = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await api.get('/users');
                if (response.data.success) {
                    setUsers(response.data.data);
                }
            } catch (err) {
                console.error("Error fetching users:", err);
                // If 403 Forbidden, they aren't admin so we handle gracefully
                if (err.response?.status === 403) {
                    setError("You do not have administrative privileges to view this page.");
                } else {
                    setError("Failed to load users. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const getRoleBadge = (role) => {
        switch (role) {
            case 'ROLE_ADMIN':
                return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200"><Shield className="w-3 h-3 mr-1 inline" /> Admin</span>;
            case 'ROLE_MANAGER':
                return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">Manager</span>;
            case 'ROLE_EMPLOYEE':
                return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">Employee</span>;
            default:
                return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">{role}</span>;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center space-y-4">
                <Shield className="h-16 w-16 text-red-500 opacity-20" />
                <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
                <p className="text-gray-600 max-w-md">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-80px)]">
            <div className="flex flex-col justify-between items-start bg-white p-6 rounded-lg shadow-sm gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <UsersIcon className="text-blue-600 h-8 w-8" />
                        Directory
                    </h1>
                    <p className="text-gray-500 mt-1">Manage system users and access roles.</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-grow flex flex-col overflow-hidden">
                <div className="overflow-x-auto flex-grow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                    {u.firstName?.[0]}{u.lastName?.[0]}
                                                    {(!u.firstName && !u.lastName) && <UserIcon className="h-5 w-5" />}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {u.firstName} {u.lastName}
                                                        {user?.id === u.id && <span className="ml-2 text-xs text-blue-500 font-normal">(You)</span>}
                                                    </div>
                                                    <div className="text-xs text-gray-500">@{u.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {u.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {u.roles?.map(role => (
                                                    <div key={role.id}>{getRoleBadge(role.name)}</div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;
