import React, { useEffect, useState } from "react";
import axios from "axios";

interface Estimate {
  id: number;
  projectName: string;
  estimatedCost?: number;
  deadline: string;
}

const Estimates = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newEstimate, setNewEstimate] = useState({
    projectName: "",
    estimatedCost: "",
    deadline: "",
  });

  const fetchEstimates = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/estimates`
      );
      const data: [string, number, string][] = response.data; // Define the expected type of the response

      // Transform the array of arrays into an array of objects
      const formattedData = data.map(
        (item: [string, number, string], index: number) => ({
          id: index + 1,
          projectName: item[0],
          estimatedCost: item[1],
          deadline: new Date(item[2]).toISOString().split("T")[0], // Format the date as YYYY-MM-DD
        })
      );

      setEstimates(formattedData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch estimates. Please try again.");
      console.error("Error fetching estimates:", err);
    } finally {
      setLoading(false);
    }
  };

  const createEstimate = async () => {
    const { projectName, estimatedCost, deadline } = newEstimate;
    if (!projectName || !estimatedCost || !deadline) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/estimates`, {
        projectName,
        estimatedCost: parseFloat(estimatedCost),
        deadline,
      });
      alert("Estimate created successfully");
      setNewEstimate({ projectName: "", estimatedCost: "", deadline: "" });
      fetchEstimates();
    } catch (err) {
      alert("Failed to create estimate");
      console.error("Error creating estimate:", err);
    }
  };

  const deleteEstimate = async (id: number) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/estimates/${id}`
      );
      alert("Estimate deleted successfully");
      fetchEstimates(); // Refresh estimates after deletion
    } catch (err) {
      alert("Failed to delete estimate");
      console.error("Error deleting estimate:", err);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, []);

  return (
    <div>
      <h1>Estimates</h1>

      {loading ? (
        <p>Loading estimates...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          {estimates.length > 0 ? (
            <ul>
              {estimates.map((estimate) => (
                <li key={estimate.id}>
                  <strong>{estimate.projectName}</strong> - $
                  {estimate.estimatedCost?.toLocaleString() || "0"} - Due:{" "}
                  {estimate.deadline}
                  <button onClick={() => deleteEstimate(estimate.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No estimates available.</p>
          )}

          <div>
            <h2>Create Estimate</h2>
            <input
              type="text"
              placeholder="Project Name"
              value={newEstimate.projectName}
              onChange={(e) =>
                setNewEstimate({ ...newEstimate, projectName: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Estimated Cost"
              value={newEstimate.estimatedCost}
              onChange={(e) =>
                setNewEstimate({
                  ...newEstimate,
                  estimatedCost: e.target.value,
                })
              }
            />
            <input
              type="date"
              value={newEstimate.deadline}
              onChange={(e) =>
                setNewEstimate({ ...newEstimate, deadline: e.target.value })
              }
            />
            <button onClick={createEstimate}>Create</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Estimates;
