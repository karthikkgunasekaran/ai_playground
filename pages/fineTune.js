import { useState, useEffect } from "react";
import styles from "./fineTune.module.css";

export default function FineTune() {
  const [fineTunedModelsRaw, setFineTunedModelsRaw] = useState([]);
  const [fineTuneModels, setFineTuneModels] = useState([]);
  const [fileInput, setFileInput] = useState(null);
  const [fileUploadResponse, setFileUploadResponse] = useState(null);
  const [fileId, setFileId] = useState('');
  const [tuneCreationResponse, setTuneCreationResponse] = useState(null);

  const convertTimestampToDatetime = (timestamp) => {
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
    return date.toLocaleString(); // Convert the date to a string in the user's local format
  };

  useEffect(() => {
    // Fetch fine-tuned models data from the API
    fetch("/api/fineTunes")
      .then((response) => response.json())
      .then((data) => {
        console.log('Fine Tunes Model list');
        console.log(data);
        setFineTunedModelsRaw(data);

        const extractedData = data.data.map((model) => ({
          fineTunedModel: model.fine_tuned_model,
          status: model.status,
          updatedAt: convertTimestampToDatetime(model.updated_at)
        }));

        setFineTuneModels(extractedData);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileInput(file);
  };

  const handleFileCreate = (event) => {
    event.preventDefault();
    if (fileInput) {
      const fileName = fileInput.name;

      // Send the file to the fineTunes API endpoint
      fetch("/api/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: fileName
        })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Fine Upload Response');
          console.log(data);
          setFileUploadResponse(data);
        })
        .catch((error) => console.error(error));

      // Reset the file input
      setFileInput(null);
    }
  };

  const handleTuneCreation = (event) => {
    event.preventDefault();
    if (fileId) {
      // Send the file ID to the fineTunes API endpoint
      fetch("/api/fineTunes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: fileId
        })
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Tune Creation Response');
          console.log(data);
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
        <div className="col-md-2">
          Upload Training Data
          <form onSubmit={handleFileCreate}>
            <input
              type="file"
              name="file"
              accept=".jsonl"
              onChange={handleFileChange}
            />
            <input type="submit" value="Submit" />
          </form>
          {fileUploadResponse && (
            <div>
              <h4>File Upload Response:</h4>
              <pre>{JSON.stringify(fileUploadResponse, null, 2)}</pre>
            </div>
          )}
        </div>
        <div className="col-md-2">
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
        <div className="col-md-6">
          Avaiable Fine Tuned Models
          <table className="table table-striped">
            <thead className="thead-light">
              <tr>
                <th className="text-white" scope="col">Fine Tuned Model</th>
                <th className="text-white" scope="col">Status</th>
                <th className="text-white" scope="col">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {fineTuneModels.map((model, index) => (
                <tr key={index}>
                  <td className="text-white">{model.fineTunedModel}</td>
                  <td className="text-white">{model.status}</td>
                  <td className="text-white">{model.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
