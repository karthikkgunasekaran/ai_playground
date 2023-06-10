import { useState, useEffect } from "react";
import styles from "./fineTune.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FineTune() {
  const [fineTuneModels, setFineTuneModels] = useState([]);
  const [fileId, setFileId] = useState('');
  const [tuneCreationResponse, setTuneCreationResponse] = useState(null);

  const convertTimestampToDatetime = (timestamp) => {
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
    return date.toLocaleString(); // Convert the date to a string in the user's local format
  };

  useEffect(() => {
    const apiKey = sessionStorage.getItem("auth-openai-apikey");

    // Fetch fine-tuned models data from the API
    fetch("/api/fineTunes", {
      headers: {
        "auth-openai-apikey": apiKey
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const extractedData = data.data.map((model) => ({
          id: model.id,
          fineTunedModel: model.fine_tuned_model,
          status: model.status,
          createdAt: convertTimestampToDatetime(model.created_at),
          updatedAt: convertTimestampToDatetime(model.updated_at)
        }));

        setFineTuneModels(extractedData);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleTuneCreation = (event) => {
    event.preventDefault();
    if (fileId) {

      const apiKey = sessionStorage.getItem("auth-openai-apikey");
      
      // Send the file ID to the fineTunes API endpoint
      fetch("/api/fineTunes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-openai-apikey": apiKey
        },
        body: JSON.stringify({
          fileId: fileId
        })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Tune Creation Response');
          setTuneCreationResponse(data);
        })
        .catch((error) => console.error(error));

      // Reset the file ID input
      setFileId('');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          Tine Tune Creation
          <form onSubmit={handleTuneCreation}>
            <input
              type="text"
              name="fileId"
              placeholder="Enter file ID"
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
            />
            <input type="submit" value="Create" />
          </form>
          {tuneCreationResponse && (
            <div>
              <h4>Fine-tune creation response Response:</h4>
              <pre>{JSON.stringify(tuneCreationResponse, null, 2)}</pre>
            </div>
          )}
        </div>
        <div className="col-md-9">
          Avaiable Fine Tuned Models
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Job Id</th>
                <th scope="col">Fine Tuned Model</th>
                <th scope="col">Status</th>
                <th scope="col">Created At</th>
                <th scope="col">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {fineTuneModels.map((model, index) => (
                <tr key={index}>
                  <td>{model.id}</td>
                  <td>{model.fineTunedModel}</td>
                  <td>{model.status}</td>
                  <td>{model.createdAt}</td>
                  <td>{model.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
