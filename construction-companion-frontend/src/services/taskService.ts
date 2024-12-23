// taskService.ts
import axios from 'axios';

interface Task {
    id: number;
    taskName: string;
    assignedTo: string;
    dueDate: string;
    status: string;
    projectName: string;
}

const fetchTasks = async (): Promise<Task[]> => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`);
        const data = response.data;

        return data.map((item: any) => ({
            id: item[0],
            taskName: item[1],
            assignedTo: item[2],
            dueDate: item[3],
            status: item[4],
            projectName: item[5],
        }));
    } catch (err) {
        console.error('Error fetching tasks:', err);
        throw new Error('Failed to fetch tasks. Please try again.');
    }
};

const createTask = async (newTask: { taskName: string; assignedTo: string; dueDate: string; status: string; projectId: string }): Promise<void> => {
    const { taskName, assignedTo, dueDate, status, projectId } = newTask;

    if (!taskName || !assignedTo || !dueDate || !status || !projectId) {
        throw new Error('All fields are required');
    }

    try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`, {
            taskName,
            assignedTo,
            dueDate,
            status,
            projectId,
        });
    } catch (err) {
        console.error('Error creating task:', err);
        throw new Error('Failed to create task.');
    }
};

const deleteTask = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${id}`);
    } catch (err) {
        console.error('Error deleting task:', err);
        throw new Error('Failed to delete task.');
    }
};

export { fetchTasks, createTask, deleteTask };