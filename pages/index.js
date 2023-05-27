import Head from "next/head";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import styles from "./index.module.css";

export default function Home() {
  const [promptInput, setPromptInput] = useState("");
  const [questionList, setQuestionList] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      const newQuestion = {
        id: uuidv4(),
        prompt: promptInput,
        errorMessage: "",
        response: data.result,
      };

      setQuestionList([...questionList, newQuestion]);
      setPromptInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  // Function to remove a question from the list
  const removeQuestion = (id) => {
    const updatedList = questionList.filter((question) => question.id !== id);
    setQuestionList(updatedList);
  };

  return (
    <div>
      <Head>
        <title>Mr.Cool - OpenAI Fine-Tuning</title>
        <link rel="icon" href="/dhoni.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dhoni.png" className={styles.icon} />
        <h3>Mr.Cool</h3>
        <ul className={styles.result} style={{ listStyleType: "none" }}>
          {questionList.map((question, index) => (
            <li key={question.id}>
              <div className={styles.listItem}>
                <div className={styles.question}>
                  <div className={styles.row}>
                    <strong>Prompt:</strong> {question.prompt}
                  </div>
                  <div className={styles.row}>
                    <strong>Response:</strong> {question.response}
                  </div>
                  {question.errorMessage && (
                    <div className={styles.row}>
                      <strong>Error Message:</strong> {question.errorMessage}
                    </div>
                  )}
                </div>
                <FontAwesomeIcon
                  icon={faTrash}
                  className={styles.removeIcon}
                  onClick={() => removeQuestion(question.id)}
                />
              </div>
              {index !== questionList.length - 1 && <hr className={styles.separator} />}
            </li>
          ))}
        </ul>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="prompt"
            placeholder="Ask me anything!"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
          />
          <input type="submit" value="Submit" />
        </form>
      </main>
    </div>
  );
}
