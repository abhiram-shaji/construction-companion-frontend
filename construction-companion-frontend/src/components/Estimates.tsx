import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Estimates = () => {
    const [estimates, setEstimates] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/estimates`)
            .then(response => setEstimates(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Estimates</h1>
            <ul>
                {estimates.map((estimate: any, index) => (
                    <li key={index}>{estimate.projectName}</li>
                ))}
            </ul>
        </div>
    );
};

export default Estimates;
