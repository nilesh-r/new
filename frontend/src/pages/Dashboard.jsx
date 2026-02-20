import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', tasks: 40, completed: 24 },
    { name: 'Feb', tasks: 30, completed: 13 },
    { name: 'Mar', tasks: 20, completed: 98 },
    { name: 'Apr', tasks: 27, completed: 39 },
    { name: 'May', tasks: 18, completed: 48 },
    { name: 'Jun', tasks: 23, completed: 38 },
    { name: 'Jul', tasks: 34, completed: 43 },
];

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Projects', value: '12', color: 'bg-blue-500' },
                    { label: 'Pending Tasks', value: '23', color: 'bg-yellow-500' },
                    { label: 'Completed Tasks', value: '145', color: 'bg-green-500' },
                    { label: 'Team Members', value: '8', color: 'bg-indigo-500' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-l-transparent hover:border-l-blue-500 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.color} bg-opacity-20 text-${stat.color.split('-')[1]}-600`}>
                                {/* Icon placeholder */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Task Productivity</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="tasks" fill="#8884d8" name="Total Tasks" />
                            <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
