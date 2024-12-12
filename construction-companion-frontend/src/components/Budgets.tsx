import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Budget {
    id: number;
    projectId: number;
    budgetLimit: number;
    currentSpend: number;
}

const Budgets = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newBudget, setNewBudget] = useState({
        projectId: '',
        budgetLimit: '',
        currentSpend: '',
    });

    const fetchBudgets = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/budgets`);
            const data = response.data;

            // Transform the array of arrays into an array of objects
            const formattedData = data.map((item: any) => ({
                id: item[0],
                projectId: item[1],
                budgetLimit: item[2],
                currentSpend: item[3],
            }));

            setBudgets(formattedData);
            setError(null);
        } catch (err) {
            setError('Failed to fetch budgets. Please try again.');
            console.error('Error fetching budgets:', err);
        } finally {
            setLoading(false);
        }
    };

    const createBudget = async () => {
        const { projectId, budgetLimit, currentSpend } = newBudget;
        if (!projectId || !budgetLimit || !currentSpend) {
            alert('Please fill in all fields');
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/budgets`, {
                projectId: parseInt(projectId, 10),
                budgetLimit: parseFloat(budgetLimit),
                currentSpend: parseFloat(currentSpend),
            });
            alert('Budget created successfully');
            setNewBudget({ projectId: '', budgetLimit: '', currentSpend: '' });
            fetchBudgets();
        } catch (err) {
            alert('Failed to create budget');
            console.error('Error creating budget:', err);
        }
    };

    const updateBudget = async (id: number, updatedBudget: { budgetLimit: number; currentSpend: number }) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/budgets/${id}`, updatedBudget);
            alert('Budget updated successfully');
            fetchBudgets();
        } catch (err) {
            alert('Failed to update budget');
            console.error('Error updating budget:', err);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    return (
        <div>
            <h1>Budgets</h1>

            {loading ? (
                <p>Loading budgets...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    {budgets.length > 0 ? (
                        <ul>
                            {budgets.map((budget) => (
                                <li key={budget.id}>
                                    <strong>Project ID:</strong> {budget.projectId} - <strong>Budget Limit:</strong> ${budget.budgetLimit.toFixed(2)} - <strong>Current Spend:</strong> ${budget.currentSpend.toFixed(2)}
                                    <button
                                        onClick={() =>
                                            updateBudget(budget.id, {
                                                budgetLimit: budget.budgetLimit + 100, // Example increment
                                                currentSpend: budget.currentSpend,
                                            })
                                        }
                                    >
                                        Update
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No budgets available.</p>
                    )}

                    <div>
                        <h2>Create Budget</h2>
                        <input
                            type="text"
                            placeholder="Project ID"
                            value={newBudget.projectId}
                            onChange={(e) => setNewBudget({ ...newBudget, projectId: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Budget Limit"
                            value={newBudget.budgetLimit}
                            onChange={(e) => setNewBudget({ ...newBudget, budgetLimit: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Current Spend"
                            value={newBudget.currentSpend}
                            onChange={(e) => setNewBudget({ ...newBudget, currentSpend: e.target.value })}
                        />
                        <button onClick={createBudget}>Create</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Budgets;
