import React, { useState, useEffect } from 'react';
import { getTasks, createTask, deleteTask as deleteTaskApi, updateTask, getUserProfile } from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const [userProfile, setUserProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await getTasks();
        setTasks(data);
      } catch (err) {
        setError('Failed to fetch tasks.');
      }
    };
    const fetchUserProfile = async () => {
      try {
        const { data } = await getUserProfile();
        setUserProfile(data);
      } catch (err) {
        console.error('Failed to fetch user profile.');
      }
    };
    fetchTasks();
    fetchUserProfile();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const { data } = await createTask({ title, status: 'To Do' }); // Use 'To Do' as initial status
      setTasks([data, ...tasks]);
      setTitle('');
    } catch (err) {
      setError('Failed to create task.');
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setNewTitle(task.title);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setNewTitle('');
  };

  const handleUpdateTask = async (id) => {
    try {
      const { data: updatedTask } = await updateTask(id, { title: newTitle });
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
      handleCancelEdit();
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Done' ? 'To Do' : 'Done'; // Toggle between 'To Do' and 'Done'
    try {
      const { data: updatedTask } = await updateTask(task._id, { status: newStatus });
      setTasks(tasks.map((t) => (t._id === task._id ? updatedTask : t)));
    } catch (err) {
      setError('Failed to update task status.');
    }
  };


  const handleDeleteTask = async (id) => {
    try {
      await deleteTaskApi(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome, {userProfile ? userProfile.name : 'User'}!
        </h1>
        <p className="text-lg text-gray-600">Here are your tasks for today.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg bg-white"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border rounded-lg bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleCreateTask} className="mb-6 flex gap-2">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task title..." className="flex-grow px-4 py-2 border rounded-lg bg-white" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Add Task</button>
      </form>
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task._id} className={`bg-white p-4 rounded-lg shadow flex justify-between items-center gap-4 ${task.status === 'Done' ? 'opacity-70' : ''}`}>
            {editingTaskId === task._id ? (
              <>
                <input
                  type="text"
                  // Ensure checkbox is not visible during edit
                  style={{ display: 'none' }}
                />
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-grow px-2 py-1 border rounded-lg bg-white"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdateTask(task._id)} className="text-green-600 hover:text-green-800">Save</button>
                  <button onClick={handleCancelEdit} className="text-gray-500 hover:text-gray-700">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.status === 'Done'}
                  onChange={() => handleToggleStatus(task)}
                  className="h-5 w-5 mr-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                <p className={`flex-grow ${task.status === 'Done' ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEditClick(task)} className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button onClick={() => handleDeleteTask(task._id)} className="text-red-500 hover:text-red-700">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;