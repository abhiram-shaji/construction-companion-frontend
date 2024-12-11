import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Estimate {
    projectName: string;
    estimatedCost: number;
}

const Estimates = () => {
    const [estimates, setEstimates] = useState<Estimate[]>([]); // Define state with correct types
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEstimates = async () => {
            try {
                console.log("Backend URL:", process.env.REACT_APP_BACKEND_URL); // Log the backend URL
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/estimates`);
                console.log("API Response:", response.data); // Log the API response
                
                if (Array.isArray(response.data)) {
                    setEstimates(response.data); // Update state with fetched data
                } else {
                    setError("API did not return an array.");
                    console.error("API did not return an array:", response.data);
                }
            } catch (err) {
                setError("Failed to fetch estimates. Please try again.");
                console.error("Error fetching estimates:", err);
            }
        };

        fetchEstimates();
    }, []);

    return (
        <div>
            <h1>Estimates</h1>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : estimates.length > 0 ? (
                <ul>
                    {estimates.map((estimate, index) => (
                        <li key={index}>
                            {estimate.projectName} - ${estimate.estimatedCost}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No estimates available.</p>
            )}
        </div>
    );
};

export default Estimates;
