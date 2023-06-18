import { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

import completeStyles from "./complete.module.css";

const baseLanguageModelOptions = ["text-ada-001", "text-babbage-001", "text-curie-001"];

export default function Complete() {
    const [promptInput, setPromptInput] = useState("");
    const [temperatureInput, setTemperatureInput] = useState(0.5);
    const [maxTokenInput, setMaxTokenInput] = useState(10);
    const [questionList, setQuestionList] = useState([]);
    const [languageModelOptions, setLanguageModelOptions] = useState([]);
    const [modelInput, setModelInput] = useState(baseLanguageModelOptions[0]);

    const responsesRef = useRef(null);
    const promptAndSubmitRef = useRef(null);

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
                    updatedAt: convertTimestampToDatetime(model.updated_at),
                }));
                const succeededModels = extractedData.filter(
                    (model) => model.status === "succeeded"
                ).map((model) => model.fineTunedModel);
                const updatedLanguageModelOptions = [
                    ...succeededModels,
                    ...baseLanguageModelOptions,
                ];
                setLanguageModelOptions(updatedLanguageModelOptions);
            })
            .catch((error) => console.error(error));
    }, []);

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
            const apiKey = sessionStorage.getItem("auth-openai-apikey");
            const response = await fetch("/api/complete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-openai-apikey": apiKey,
                },
                body: JSON.stringify({
                    prompt: promptInput,
                    model: modelInput,
                    temperature: temperatureInput,
                    maxTokens: maxTokenInput
                })
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
            console.error(error);
            alert(error.message);
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-9">
                    <div ref={responsesRef} className={completeStyles.responses}>
                        <div className={completeStyles.responsesContent}>
                            <ul className={completeStyles.result} style={{ listStyleType: "none" }}>
                                {questionList.map((question, index) => (
                                    <li key={question.id}>
                                        <div className={completeStyles.listItem}>
                                            <div className={completeStyles.question}>
                                                <div className={completeStyles.row}>
                                                    <strong>Prompt:</strong> {question.prompt}
                                                </div>
                                                <div className={completeStyles.row}>
                                                    <strong>Response:</strong> {question.response}
                                                </div>
                                                {question.errorMessage && (
                                                    <div className={completeStyles.row}>
                                                        <strong>Error Message:</strong> {question.errorMessage}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {index !== questionList.length - 1 && <hr className={completeStyles.separator} />}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div ref={promptAndSubmitRef} className={completeStyles.promptAndSubmit}>
                        <form onSubmit={onSubmit} className={completeStyles.form}>
                            <textarea
                                name="prompt"
                                placeholder="Ask me anything!"
                                value={promptInput}
                                onChange={(e) => setPromptInput(e.target.value)}
                                className={completeStyles.textarea}
                            />
                            <button type="submit" className={completeStyles.sendButton}>
                                <div className={completeStyles.sendButtonContent}>
                                    <FontAwesomeIcon icon={faPaperPlane} className={completeStyles.icon} />
                                </div>
                            </button>
                        </form>
                    </div>

                </div>
                <div className={`${completeStyles.settingsBg} col-md-3`} >
                    <div>
                        <label htmlFor="modelDropdown" className={completeStyles.settingsItemLabel}>Model</label>
                    </div>
                    <select
                        id="modelDropdown"
                        name="model"
                        value={modelInput}
                        onChange={(e) => setModelInput(e.target.value)}
                        style={{ width: "100%" }}
                    >
                        {languageModelOptions.map((model) => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>
                    <div>
                        <label htmlFor="temperatureInput" className={completeStyles.settingsItemLabel}>
                            Temperature <span className={completeStyles.settingsItemValue}>{temperatureInput}</span>
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
                        <label htmlFor="maxTokenInput" className={completeStyles.settingsItemLabel}>
                            Maximum Token <span className={completeStyles.settingsItemValue}>{maxTokenInput}</span>
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
            </div>
        </div>
    );
}
