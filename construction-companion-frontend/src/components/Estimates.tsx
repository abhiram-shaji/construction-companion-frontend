import React, { useEffect, useState } from "react";
import { fetchEstimates, createEstimate, deleteEstimate } from "../services/estimateService";

interface Estimate {
  id: number;
  projectName: string;
  estimatedCost?: number;
  deadline: string;
}

const Estimates: React.FC = () => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newEstimate, setNewEstimate] = useState({
    projectName: "",
    estimatedCost: "",
    deadline: "",
  });

  const loadEstimates = async () => {
    try {
      setLoading(true);
      const data = await fetchEstimates();
      setEstimates(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEstimate = async () => {
    try {
      await createEstimate(newEstimate);
      alert("Estimate created successfully");
      setNewEstimate({ projectName: "", estimatedCost: "", deadline: "" });
      loadEstimates();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteEstimate = async (id: number) => {
    try {
      await deleteEstimate(id);
      alert("Estimate deleted successfully");
      loadEstimates();
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadEstimates();
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
                  <button onClick={() => handleDeleteEstimate(estimate.id)}>
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
            <button onClick={handleCreateEstimate}>Create</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Estimates;
