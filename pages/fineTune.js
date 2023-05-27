import { useState } from "react";
import styles from "./fineTune.module.css";

export default function FineTune() {
  const [fileInput, setFileInput] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileInput(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (fileInput) {
      // Process the uploaded file
      // Implement your logic here for handling the uploaded file
      console.log(fileInput);
      // Reset the file input
      setFileInput(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="file"
          accept=".jsonl"
          onChange={handleFileChange}
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
