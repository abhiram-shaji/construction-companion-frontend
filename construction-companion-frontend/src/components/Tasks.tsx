import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
    id: number;
    taskName: string;
    assignedTo: string;
    dueDate: string;
    status: string;
    projectName: string;
}

const Tasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newTask, setNewTask] = useState({
        taskName: '',
        assignedTo: '',
        dueDate: '',
        status: '',
        projectId: '',
    });

    const fetchTasks = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`);
            const data = response.data;

            // Transform the array of arrays into an array of objects
            const formattedData = data.map((item: any) => ({
                id: item[0],
                taskName: item[1],
                assignedTo: item[2],
                dueDate: item[3],
                status: item[4],
                projectName: item[5],
            }));

            setTasks(formattedData);
            setError(null);
        } catch (err) {
            setError('Failed to fetch tasks. Please try again.');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async () => {
        const { taskName, assignedTo, dueDate, status, projectId } = newTask;
        if (!taskName || !assignedTo || !dueDate || !status || !projectId) {
            alert('Please fill in all fields');
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`, {
                taskName,
                assignedTo,
                dueDate,
                status,
                projectId,
            });
            alert('Task created successfully');
            setNewTask({ taskName: '', assignedTo: '', dueDate: '', status: '', projectId: '' });
            fetchTasks();
        } catch (err) {
            alert('Failed to create task');
            console.error('Error creating task:', err);
        }
    };

    const deleteTask = async (id: number) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`);
            alert('Task deleted successfully');
            fetchTasks();
        } catch (err) {
            alert('Failed to delete task');
            console.error('Error deleting task:', err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div>
            <h1>Tasks</h1>

            {loading ? (
                <p>Loading tasks...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    {tasks.length > 0 ? (
                        <ul>
                            {tasks.map((task) => (
                                <li key={task.id}>
                                    <strong>{task.taskName}</strong> - Assigned to: {task.assignedTo} - Due: {task.dueDate} - Status: {task.status} - Project: {task.projectName}
                                    <button onClick={() => deleteTask(task.id)}>Delete</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tasks available.</p>
                    )}

                    <div>
                        <h2>Create Task</h2>
                        <input
                            type="text"
                            placeholder="Task Name"
                            value={newTask.taskName}
                            onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Assigned To"
                            value={newTask.assignedTo}
                            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                        />
                        <input
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Status"
                            value={newTask.status}
                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Project ID"
                            value={newTask.projectId}
                            onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                        />
                        <button onClick={createTask}>Create</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Tasks;
