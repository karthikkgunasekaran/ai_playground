import { useState, useEffect } from "react";
import styles from "./settings.module.css";
import commonStyles from "./common.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Settings() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const storedApiKey = sessionStorage.getItem("auth-openai-apikey");
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleUpdateApiKey = () => {
    sessionStorage.setItem("auth-openai-apikey", apiKey);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4 offset-md-1">
          <div className="form-group">
            <label htmlFor="apiKeyInput" className="my-3">API Key</label>
            <input
              type="password"
              id="apiKeyInput"
              value={apiKey}
              onChange={handleApiKeyChange}
              className="form-control"
            />
          </div>
          <button onClick={handleUpdateApiKey} className="my-3 btn btn-primary">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
