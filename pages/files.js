import { useState, useEffect } from "react";
import styles from "./files.module.css";
import commonStyles from "./common.module.css";

export default function Files() {
  const [filesList, setFilesList] = useState([]);
  const [fileInput, setFileInput] = useState(null);
  const [fileUploadResponse, setFileUploadResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);


  const convertTimestampToDatetime = (timestamp) => {
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
    return date.toLocaleString(); // Convert the date to a string in the user's local format
  };

  useEffect(() => {
    const apiKey = sessionStorage.getItem("auth-openai-apikey");

    // Fetch fine-tuned models data from the API
    fetch("/api/files", {
      headers: {
        "auth-openai-apikey": apiKey
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const extractedData = data.data.map((model) => ({
          id: model.id,
          filename: model.filename,
          purpose: model.purpose,
          createdAt: convertTimestampToDatetime(model.created_at)
        }));

        setFilesList(extractedData);
      })
      .catch((error) => console.error(error));
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileInput(file);
  };

  const handleFileCreate = (event) => {
    event.preventDefault();
    if (!fileInput) {
      alert("Please select a file to upload");
      return;
    }

    setFileUploadResponse(null);
    toggleModal();
    setShowProgress(true);
    const formData = new FormData();
    formData.append("file", fileInput);
    console.log(formData);
    const apiKey = sessionStorage.getItem("auth-openai-apikey");
    // Send the file to the fineTunes API endpoint
    fetch("/api/files", {
      method: "POST",
      headers: {
        "auth-openai-apikey": apiKey
      },
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        setFileUploadResponse(data);
      })
      .catch((error) => console.error(error));

    // Reset the file input
    setFileInput(null);
  };

  return (
    <div className="container-fluid">
      {showProgress && (
        <div className="row bg-light">
          <div className={`col-md-12 ${styles.fileUploadResponse}`}>
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="text-center">File Upload Response</h4>
              <button
                type="button"
                className={`btn btn-sm btn-secondary ${styles.closeButton}`}
                onClick={() => setShowProgress(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            {!fileUploadResponse && (
              <div className="text-center my-3">File upload is in progress. Please wait...</div>
            )}

            {fileUploadResponse && (
              <div>
                <pre>{JSON.stringify(fileUploadResponse, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="row my-3">
        <div className="col-md-12 d-flex justify-content-end">
          <button className="btn btn-primary" onClick={() => { setShowProgress(false); toggleModal(); }}>
            + New File
          </button>
          {showModal && (
            <div className={`modal ${commonStyles.centeredModal}`} tabIndex="-1" role="dialog">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Add New File</h5>
                    <button type="button" class="close" onClick={toggleModal} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <form onSubmit={handleFileCreate}>
                      <input
                        type="file"
                        name="file"
                        accept=".jsonl"
                        onChange={handleFileChange}
                      />
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={handleFileCreate}>
                      Save changes
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={toggleModal}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <table className="table table-bordered table-hover">
            <thead>
              <tr class="text-primary">
                <th scope="col">File Id</th>
                <th scope="col">File Name</th>
                <th scope="col">Purpose</th>
                <th scope="col">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filesList.map((model, index) => (
                <tr key={index}>
                  <td>{model.id}</td>
                  <td>{model.filename}</td>
                  <td>{model.purpose}</td>
                  <td>{model.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
