import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, deleteTask } from '../services/taskService';

interface Task {
    id: number;
    taskName: string;
    assignedTo: string;
    dueDate: string;
    status: string;
    projectName: string;
}

const Tasks: React.FC = () => {
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

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await fetchTasks();
            setTasks(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async () => {
        try {
            await createTask(newTask);
            alert('Task created successfully');
            setNewTask({ taskName: '', assignedTo: '', dueDate: '', status: '', projectId: '' });
            loadTasks();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDeleteTask = async (id: number) => {
        try {
            await deleteTask(id);
            alert('Task deleted successfully');
            loadTasks();
        } catch (err: any) {
            alert(err.message);
        }
    };

    useEffect(() => {
        loadTasks();
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
                                    <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
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
                        <button onClick={handleCreateTask}>Create</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Tasks;
