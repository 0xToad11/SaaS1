import React, { useState } from "react";
import axios from "axios";

export default function EmailReplier() {
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [to, setTo] = useState("");
  const [prompt, setPrompt] = useState("");
  const [selectedTone, setSelectedTone] = useState("Formal"); // Set 'Excellent' as default
  const [responseMessage, setResponseMessage] = useState("");

  const handleToChange = (event) => {
    setTo(event.target.value);
  };

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleClickTone = (value) => {
    setSelectedTone(value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const combinedPrompt = `type ${selectedTone} e-mail to ${to} about ${prompt}`;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/generate-reply",
        { prompt: combinedPrompt }
      );
      console.log("Response:", response.data);
      setResponseMessage(response.data.reply); // Assuming the response contains the reply
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <div>
      <div className="text-center text-3xl font-semibold pt-10 ">
        E-mail replier
      </div>
      <div className="flex pt-20">
        <div className="w-1/3 pl-20 border pt-8 pb-12 rounded-xl border-slate-500 ml-20 text-slate-200">
          <div className="py-2">Create an E-mail reply</div>
          <div className="flex pb-2">
            <div className="">To:</div>{" "}
            <div>
              <textarea
                className="opacity-50 font-thin bg-slate-800 ml-2 h-8 w-5/6 px-2 border border-blue-700 shadow-lg shadow-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
                value={to}
                onChange={handleToChange}
              ></textarea>
            </div>
          </div>
          <div className="pb-2">Type what you want to convey</div>
          <textarea
            className="opacity-50 font-thin bg-slate-800 h-24 w-3/4 px-4 border border-blue-700 shadow-lg shadow-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
            placeholder="Enter your text here..."
            value={prompt}
            onChange={handlePromptChange}
          ></textarea>
          <div className="pt-4 pb-1">Tone</div>
          <div className="flex">
            <div className="border rounded-3xl flex py-1">
              <button
                className={`border rounded-2xl border-transparent w-20 px-2 py-1 mx-1 ${
                  selectedTone === "Formal" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleClickTone("Formal")}
              >
                Formal
              </button>
              <button
                className={`border rounded-2xl border-transparent w-20 px-2 py-1 mx-1 ${
                  selectedTone === "Informal" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleClickTone("Informal")}
              >
                Informal
              </button>
            </div>
          </div>
          {!isLoading ? (
            <button onClick={handleSubmit} className="button-76 mt-8">
              Generate
            </button>
          ) : (
            <div className="loader mt-8"></div>
          )}
        </div>

        <div className="w-2/3">
          <div className="flex justify-center"></div>
          <div>E-mail reply</div>
          {responseMessage && (
          <div className="mt-4 p-4 border rounded-xl border-slate-500 bg-slate-800 text-slate-200 whitespace-pre-wrap">
            <p>{responseMessage}</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
