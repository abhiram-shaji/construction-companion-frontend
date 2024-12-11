import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Estimates = () => {
    const [estimates, setEstimates] = useState<any[]>([]); // Ensure it's initialized as an empty array

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/estimates`)
            .then(response => {
                // Check if response.data is an array
                if (Array.isArray(response.data)) {
                    setEstimates(response.data);
                } else {
                    console.error("API did not return an array:", response.data);
                }
            })
            .catch(error => {
                console.error("Error fetching estimates:", error);
            });
    }, []);

    return (
        <div>
            <h1>Estimates</h1>
            <ul>
                {estimates.map((estimate, index) => (
                    <li key={index}>{estimate.projectName}</li>
                ))}
            </ul>
        </div>
    );
};

export default Estimates;
