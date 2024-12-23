import React, { useEffect, useState } from 'react';
import { fetchBudgets, createBudget, updateBudget } from '../services/budgetService';

interface Budget {
    id: number;
    projectId: number;
    budgetLimit: number;
    currentSpend: number;
}

const Budgets: React.FC = () => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [newBudget, setNewBudget] = useState({
        projectId: '',
        budgetLimit: '',
        currentSpend: '',
    });

    const loadBudgets = async () => {
        try {
            setLoading(true);
            const data = await fetchBudgets();
            setBudgets(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBudget = async () => {
        try {
            await createBudget(newBudget);
            alert('Budget created successfully');
            setNewBudget({ projectId: '', budgetLimit: '', currentSpend: '' });
            loadBudgets();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleUpdateBudget = async (id: number, updatedData: { budgetLimit: number; currentSpend: number }) => {
        try {
            await updateBudget(id, updatedData);
            alert('Budget updated successfully');
            loadBudgets();
        } catch (err: any) {
            alert(err.message);
        }
    };

    useEffect(() => {
        loadBudgets();
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
                                            handleUpdateBudget(budget.id, {
                                                budgetLimit: budget.budgetLimit + 100,
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
                        <button onClick={handleCreateBudget}>Create</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Budgets;
