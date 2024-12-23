// budgetService.ts
import axios from 'axios';

interface Budget {
    id: number;
    projectId: number;
    budgetLimit: number;
    currentSpend: number;
}

const fetchBudgets = async (): Promise<Budget[]> => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/budgets`);
        const data = response.data;

        return data.map((item: any) => ({
            id: item[0],
            projectId: item[1],
            budgetLimit: item[2],
            currentSpend: item[3],
        }));
    } catch (err) {
        console.error('Error fetching budgets:', err);
        throw new Error('Failed to fetch budgets. Please try again.');
    }
};

const createBudget = async (newBudget: { projectId: string; budgetLimit: string; currentSpend: string }): Promise<void> => {
    const { projectId, budgetLimit, currentSpend } = newBudget;

    if (!projectId || !budgetLimit || !currentSpend) {
        throw new Error('All fields are required');
    }

    try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/budgets`, {
            projectId: parseInt(projectId, 10),
            budgetLimit: parseFloat(budgetLimit),
            currentSpend: parseFloat(currentSpend),
        });
    } catch (err) {
        console.error('Error creating budget:', err);
        throw new Error('Failed to create budget.');
    }
};

const updateBudget = async (id: number, updatedBudget: { budgetLimit: number; currentSpend: number }): Promise<void> => {
    try {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${id}`, updatedBudget);
    } catch (err) {
        console.error('Error updating budget:', err);
        throw new Error('Failed to update budget.');
    }
};

export { fetchBudgets, createBudget, updateBudget };