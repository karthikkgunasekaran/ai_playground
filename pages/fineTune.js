import { useState, useEffect } from "react";
import styles from "./fineTune.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import commonStyles from "./common.module.css";

export default function FineTune() {
  const [fineTuneModels, setFineTuneModels] = useState([]);
  const [fileId, setFileId] = useState('');
  const [tuneCreationResponse, setTuneCreationResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const convertTimestampToDatetime = (timestamp) => {
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
    return date.toLocaleString(); // Convert the date to a string in the user's local format
  };

  useEffect(() => {
    const apiKey = sessionStorage.getItem("auth-openai-apikey");
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

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleTuneCreation = (event) => {
    event.preventDefault();
    if (!fileId) {
      alert("Please enter valid file id");
      return;
    }

    setTuneCreationResponse(null);
    toggleModal();
    setShowProgress(true);
    const apiKey = sessionStorage.getItem("auth-openai-apikey");
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
    setFileId('');
  };

  return (
    <div className="container-fluid">
      {showProgress && (
        <div className="row bg-light">
          <div className={`col-md-12 ${styles.tuneCreationResponse}`}>
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

            {!tuneCreationResponse && (
              <div className="text-center my-3">Request is in progress. Please wait...</div>
            )}

            {tuneCreationResponse && (
              <div>
                <pre>{JSON.stringify(tuneCreationResponse, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="row my-3">
        <div className="col-md-12 d-flex justify-content-end">
          <button className="btn btn-primary" onClick={() => { setShowProgress(false); toggleModal(); }}>
            + New Fine-Tuned model
          </button>
          {showModal && (
            <div className={`modal ${commonStyles.centeredModal}`} tabIndex="-1" role="dialog">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Add New Fine-Tuned Model</h5>
                    <button type="button" class="close" onClick={toggleModal} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <form onSubmit={handleTuneCreation}>
                      <input
                        type="text"
                        name="fileId"
                        placeholder="Enter file ID"
                        value={fileId}
                        onChange={(e) => setFileId(e.target.value)}
                      />
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-primary" onClick={handleTuneCreation}>
                      Create
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
