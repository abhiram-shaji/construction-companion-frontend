// estimateService.ts
import axios from 'axios';

interface Estimate {
  id: number;
  projectName: string;
  estimatedCost?: number;
  deadline: string;
}

const fetchEstimates = async (): Promise<Estimate[]> => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/estimates`);
    const data: [string, number, string][] = response.data;

    return data.map((item: [string, number, string], index: number) => ({
      id: index + 1,
      projectName: item[0],
      estimatedCost: item[1],
      deadline: new Date(item[2]).toISOString().split('T')[0],
    }));
  } catch (err) {
    console.error('Error fetching estimates:', err);
    throw new Error('Failed to fetch estimates. Please try again.');
  }
};

const createEstimate = async (newEstimate: { projectName: string; estimatedCost: string; deadline: string }): Promise<void> => {
  const { projectName, estimatedCost, deadline } = newEstimate;
  if (!projectName || !estimatedCost || !deadline) {
    throw new Error('All fields are required');
  }

  try {
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/estimates`, {
      projectName,
      estimatedCost: parseFloat(estimatedCost),
      deadline,
    });
  } catch (err) {
    console.error('Error creating estimate:', err);
    throw new Error('Failed to create estimate.');
  }
};

const deleteEstimate = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/estimates/${id}`);
  } catch (err) {
    console.error('Error deleting estimate:', err);
    throw new Error('Failed to delete estimate.');
  }
};

export { fetchEstimates, createEstimate, deleteEstimate };