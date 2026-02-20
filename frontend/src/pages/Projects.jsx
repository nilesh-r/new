import { useState, useEffect } from 'react';
import api from '../services/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data or API call
        setProjects([
            { id: 1, name: 'Website Redesign', description: 'Revamp the company website.', status: 'In Progress' },
            { id: 2, name: 'Mobile App', description: 'Develop iOS and Android apps.', status: 'Planning' },
        ]);
        setLoading(false);
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">Create Project</button>
            </div>

            <div className="grid gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
                            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">{project.status}</span>
                        </div>
                        <p className="text-gray-600 mt-2">{project.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
