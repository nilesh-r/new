import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, CheckSquare, Loader2, Search, Filter } from 'lucide-react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTasks = tasks.filter(task =>
        task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.project?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Form State
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        deadline: '',
        projectId: ''
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tasksRes, projectsRes] = await Promise.all([
                api.get('/tasks?size=50'), // Fetching 50 for simplicity instead of pagination UI for now
                api.get('/projects')
            ]);

            if (tasksRes.data.success) setTasks(tasksRes.data.data.content || []);
            if (projectsRes.data.success) setProjects(projectsRes.data.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setError(null);

        try {
            // Ensure deadline is in correct format (ISO 8601 with time if backend expects LocalDateTime)
            const payload = { ...newTask };
            if (payload.deadline) {
                payload.deadline = new Date(payload.deadline).toISOString();
            }

            await api.post('/tasks', payload);
            setIsModalOpen(false);
            setNewTask({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', deadline: '', projectId: '' });
            fetchData();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create task.');
        } finally {
            setSubmitLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
            case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'DONE': return 'bg-green-100 text-green-800';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6 flex flex-col h-[calc(100vh-80px)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-lg shadow-sm gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <CheckSquare className="text-blue-600 h-8 w-8" />
                        Tasks
                    </h1>
                    <p className="text-gray-500 mt-1">Track and manage individual assignments.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition font-medium flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                    <Plus className="h-5 w-5" /> New Task
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-grow flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex gap-4">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto flex-grow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white sticky top-0">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Task</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredTasks.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No tasks found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50 transition cursor-pointer">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900">{task.title}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs">{task.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {task.project?.name || 'Unassigned'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={async (e) => {
                                                    try {
                                                        await api.patch(`/tasks/${task.id}/status?status=${e.target.value}`);
                                                        fetchData(); // Refresh to show new status
                                                    } catch (err) {
                                                        console.error("Failed to update status", err);
                                                        alert("Failed to update task status");
                                                    }
                                                }}
                                                value={task.status}
                                                className={`text-xs font-semibold rounded-full px-2.5 py-1 outline-none cursor-pointer appearance-none ${getStatusColor(task.status)} border-none text-center`}
                                            >
                                                <option value="TODO">TODO</option>
                                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                                <option value="DONE">DONE</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md border ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {task.deadline ? new Date(task.deadline).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Task Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
                            <h2 className="text-xl font-bold text-gray-800">Create New Task</h2>
                        </div>

                        <div className="overflow-y-auto p-6 flex-grow">
                            <form id="task-form" onSubmit={handleCreateTask} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project <span className="text-red-500">*</span></label>
                                        <select
                                            required
                                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            value={newTask.projectId}
                                            onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                                        >
                                            <option value="" disabled>Select a project</option>
                                            {projects.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                        <input
                                            type="datetime-local"
                                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                                            value={newTask.deadline}
                                            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                        >
                                            <option value="LOW">Low</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HIGH">High</option>
                                            <option value="CRITICAL">Critical</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                            value={newTask.status}
                                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                        >
                                            <option value="TODO">To Do</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="DONE">Done</option>
                                        </select>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
                            <button
                                type="button"
                                onClick={() => { setIsModalOpen(false); setError(null); }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="task-form"
                                disabled={submitLoading || !newTask.title.trim() || !newTask.projectId}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                {submitLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Task'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
