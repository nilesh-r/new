import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { Loader2, FolderKanban, CheckSquare, Users } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        pendingTasks: 0,
        completedTasks: 0,
        teamMembers: 0,
    });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // Fetch all raw data required for stats
                const [projectsRes, tasksRes, usersRes] = await Promise.all([
                    api.get('/projects'),
                    api.get('/tasks?size=100'),
                    api.get('/users').catch(() => ({ data: { data: [] } })) // 403 if not admin, handled gracefully
                ]);

                const projects = projectsRes.data?.data || [];
                const tasks = tasksRes.data?.data?.content || [];
                const users = usersRes.data?.data || [];

                const pendingTasks = tasks.filter(t => t.status !== 'DONE').length;
                const completedTasks = tasks.filter(t => t.status === 'DONE').length;

                setStats({
                    totalProjects: projects.length,
                    pendingTasks: pendingTasks,
                    completedTasks: completedTasks,
                    teamMembers: users.length,
                });

                // Generate basic chart data based on task priorities for a real dynamic chart
                if (tasks.length > 0) {
                    const priorityCounts = {
                        LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0
                    };
                    tasks.forEach(t => priorityCounts[t.priority]++);

                    setChartData([
                        { name: 'Low', count: priorityCounts.LOW },
                        { name: 'Medium', count: priorityCounts.MEDIUM },
                        { name: 'High', count: priorityCounts.HIGH },
                        { name: 'Critical', count: priorityCounts.CRITICAL },
                    ]);
                }

            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
            </div>
        );
    }

    const statCards = [
        { label: 'Total Projects', value: stats.totalProjects, color: 'bg-blue-500', icon: <FolderKanban className="h-6 w-6 text-blue-600" /> },
        { label: 'Pending Tasks', value: stats.pendingTasks, color: 'bg-yellow-500', icon: <CheckSquare className="h-6 w-6 text-yellow-600" /> },
        { label: 'Completed Tasks', value: stats.completedTasks, color: 'bg-green-500', icon: <CheckSquare className="h-6 w-6 text-green-600" /> },
        { label: 'Team Members', value: stats.teamMembers > 0 ? stats.teamMembers : '--', color: 'bg-indigo-500', icon: <Users className="h-6 w-6 text-indigo-600" /> },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border-l-4 hover:-translate-y-1 transition-transform" style={{ borderLeftColor: stat.color.replace('bg-', '') }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full bg-opacity-10 bg-gray-100`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">Tasks by Priority</h2>
                <div className="h-80">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} name="Tasks" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex justify-center items-center h-full text-gray-400">
                            Not enough task data to generate chart.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
