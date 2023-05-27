import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import playgroundStyles from "./playground.module.css";

const predefinedModels = ["text-ada-001", "text-babbage-001", "text-curie-001"];

export default function Playground() {
    const [promptInput, setPromptInput] = useState("");
    const [modelInput, setModelInput] = useState(predefinedModels[0]);
    const [temperatureInput, setTemperatureInput] = useState(0.5);
    const [maxTokenInput, setMaxTokenInput] = useState(10);
    const [questionList, setQuestionList] = useState([]);

    const responsesRef = useRef(null);
    const promptAndSubmitRef = useRef(null);

    // Function to remove a question from the list
    const removeQuestion = (id) => {
        const updatedList = questionList.filter((question) => question.id !== id);
        setQuestionList(updatedList);
    };

    useEffect(() => {
        const responsesContainer = responsesRef.current;
        const responsesContent = responsesContainer.querySelector(".responses-content");
        const promptAndSubmitContainer = promptAndSubmitRef.current;

        const responsesHeight = responsesContainer.offsetHeight;
        const promptAndSubmitHeight = promptAndSubmitContainer.offsetHeight;
        const windowHeight = window.innerHeight;

        if (promptAndSubmitContainer && responsesContent) {
            if (responsesHeight + promptAndSubmitHeight < windowHeight) {
                promptAndSubmitContainer.style.position = "fixed";
                promptAndSubmitContainer.style.bottom = 0;

                responsesContent.style.maxHeight = `${windowHeight - promptAndSubmitHeight}px`;
            } else {
                promptAndSubmitContainer.style.position = "static";
                responsesContent.style.maxHeight = "none";
            }
        }

    }, [questionList]);

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: promptInput,
                    model: modelInput,
                    temperature: temperatureInput,
                    maxTokens: maxTokenInput
                }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            const newQuestion = {
                id: uuidv4(),
                prompt: promptInput,
                errorMessage: "",
                response: data.result
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
        <div className="container-fluid">
            <div className="row">
                <div className={`${playgroundStyles.settingsBg} col-md-3`} >
                    <div>
                        <label htmlFor="modelDropdown" className={playgroundStyles.settingsItemLabel}>Model</label>
                    </div>
                    <select
                        id="modelDropdown"
                        name="model"
                        value={modelInput}
                        onChange={(e) => setModelInput(e.target.value)}
                        style={{ width: "100%" }}
                    >
                        {predefinedModels.map((model) => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>
                    <div>
                        <label htmlFor="temperatureInput" className={playgroundStyles.settingsItemLabel}>
                            Temperature <span className={playgroundStyles.settingsItemValue}>{temperatureInput}</span>
                        </label>
                    </div>

                    <input
                        id="temperatureInput"
                        type="range"
                        min={0}
                        max={2}
                        step={0.1}
                        value={temperatureInput}
                        onChange={(e) => setTemperatureInput(parseFloat(e.target.value))}
                        style={{ width: "100%" }}
                    />

                    <div>
                        <label htmlFor="maxTokenInput" className={playgroundStyles.settingsItemLabel}>
                            Maximum Token <span className={playgroundStyles.settingsItemValue}>{maxTokenInput}</span>
                        </label>
                    </div>

                    <input
                        id="maxTokenInput"
                        type="range"
                        min={10}
                        max={200}
                        step={10}
                        value={maxTokenInput}
                        onChange={(e) => setMaxTokenInput(parseFloat(e.target.value))}
                        style={{ width: "100%" }}
                    />
                </div>
                <div className="col-md-9">
                    <div ref={responsesRef} className={playgroundStyles.responses}>
                        <div className={playgroundStyles.responsesContent}>
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
                        </div>
                    </div>
                    <div ref={promptAndSubmitRef} className={playgroundStyles.promptAndSubmit}>
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
                </div>
            </div>
        </div>
    );
}
