import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, FolderKanban, Calendar, Users, Loader2 } from 'lucide-react';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await api.get('/projects');
            if (response.data.success) {
                setProjects(response.data.data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch projects. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setError(null);
        try {
            await api.post('/projects', newProject);
            setIsModalOpen(false);
            setNewProject({ name: '', description: '' });
            fetchProjects(); // Refresh list after creation
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to create project.');
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <Loader2 className="animate-spin h- 10 w-10 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <FolderKanban className="text-blue-600 h-8 w-8" />
                        Projects
                    </h1>
                    <p className="text-gray-500 mt-1">Manage and track your team's initiatives.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition font-medium flex items-center gap-2 shadow-sm"
                >
                    <Plus className="h-5 w-5" /> Create Project
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                    <p>{error}</p>
                </div>
            )}

            {projects.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-dashed border-gray-300">
                    <FolderKanban className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-800 leading-tight">{project.name}</h3>
                            </div>
                            <p className="text-gray-600 text-sm flex-grow mb-6 line-clamp-3">
                                {project.description || 'No description provided.'}
                            </p>

                            <div className="mt-auto pt-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>{project.members?.length || 0} Members</span>
                                </div>
                                {project.createdAt && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Create New Project</h2>
                        </div>
                        <form onSubmit={handleCreateProject} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="e.g., Q3 Marketing Campaign"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-24 resize-none"
                                    placeholder="Briefly describe the project goals..."
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setError(null);
                                    }}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitLoading || !newProject.name.trim()}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center min-w-[100px] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
