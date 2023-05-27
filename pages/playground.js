import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import playgroundStyles from "./playground.module.css";

const predefinedModels = ["text-ada-001", "text-babbage-001", "text-curie-001"];

export default function Playground() {
    const [promptInput, setPromptInput] = useState("");
    const [modelInput, setModelInput] = useState(predefinedModels[0]);
    const [questionList, setQuestionList] = useState([]);

    // Function to remove a question from the list
    const removeQuestion = (id) => {
        const updatedList = questionList.filter((question) => question.id !== id);
        setQuestionList(updatedList);
    };

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: promptInput, model: modelInput }),
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

    return (
        <div>
            <select
                name="model"
                value={modelInput}
                onChange={(e) => setModelInput(e.target.value)}
            >
                {predefinedModels.map((model) => (
                    <option key={model} value={model}>
                        {model}
                    </option>
                ))}
            </select>

            <ul className={playgroundStyles.result} style={{ listStyleType: "none" }}>
                {questionList.map((question, index) => (
                    <li key={question.id}>
                        <div className={playgroundStyles.listItem}>
                            <div className={playgroundStyles.question}>
                                <div className={playgroundStyles.row}>
                                    <strong>Prompt:</strong> {question.prompt}
                                </div>
                                <div className={playgroundStyles.row}>
                                    <strong>Response:</strong> {question.response}
                                </div>
                                {question.errorMessage && (
                                    <div className={playgroundStyles.row}>
                                        <strong>Error Message:</strong> {question.errorMessage}
                                    </div>
                                )}
                            </div>
                            <FontAwesomeIcon
                                icon={faTrash}
                                className={playgroundStyles.removeIcon}
                                onClick={() => removeQuestion(question.id)}
                            />
                        </div>
                        {index !== questionList.length - 1 && <hr className={playgroundStyles.separator} />}
                    </li>
                ))}
            </ul>
            <form onSubmit={onSubmit}>
                <textarea
                    name="prompt"
                    placeholder="Ask me anything!"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    className={playgroundStyles.textarea}
                />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}
