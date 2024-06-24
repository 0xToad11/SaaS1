import React, { useState } from "react";
import axios from "axios";

export default function GenerateImages() {
  const [selectedQuality, setSelectedQuality] = useState("Excellent"); // Set 'Excellent' as default
  const [selectedDimension, setSelectedDimension] = useState("3D"); // Set 'Excellent' as default
  const [selectedShape, setSelectedShape] = useState("Square"); // Set 'Excellent' as default
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "/images/mainpage/CatCoupleEating.png"
  );
  const [isLoading, setIsLoading] = useState(false); // State for loader


  const handleClickQuality = (value) => {
    setSelectedQuality(value);
  };

  const handleClickDimension = (value) => {
    setSelectedDimension(value);
  };

  const handleClickShape = (value) => {
    setSelectedShape(value);
  };

  const generateImage = async () => {
    setIsLoading(true); // Show loader
    const model = selectedQuality === "Excellent" ? "dall-e-3" : "dall-e-2";
    const combinedPrompt = `${prompt} ${selectedDimension}`;

    let size;
    switch (selectedShape) {
      case "Square":
        size = "1024x1024";
        break;
      case "Horizontal":
        size = "1792x1024";
        break;
      case "Vertical":
        size = "1024x1792";
        break;
      default:
        size = "1024x1024"; // Default to square if something goes wrong
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/generate-image",
        { prompt: combinedPrompt, model: model, size: size }
      );
      console.log(response);
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    }
    finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <div>
      <div className="text-center text-3xl font-semibold pt-10 ">
        Image Generator
      </div>
      <div className="lg:flex pt-6 lg:pt-20">
        <div className="lg:w-1/3 pl-2 lg:pl-20 border pt-2 lg:pt-8 pb-6 lg:pb-12 rounded-xl border-slate-500 ml-6 mr-6 lg:mr-0 lg:ml-20 text-slate-200">
          <div className="text-xs lg:text-base py-2">Create an Image from text prompt</div>
          <textarea
            placeholder="Enter your prompt"
            className="text-xs lg:text-base opacity-50 font-thin bg-slate-800 h-16 lg:h-24 w-11/12 lg:w-3/4 px-4 border border-blue-700 shadow-lg shadow-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <div className="text-xs lg:text-base pt-4 pb-1">Quality</div>
          <div className="flex">
            <div className="border rounded-3xl flex py-1">
              <button
                className={`text-xs lg:text-base border rounded-2xl border-transparent w-20 px-2 py-1 mx-1 ${
                  selectedQuality === "Good" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleClickQuality("Good")}
              >
                Good
              </button>
              <button
                className={`text-xs lg:text-base border rounded-2xl border-transparent w-20 px-2 py-1 mx-1 ${
                  selectedQuality === "Excellent"
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
                onClick={() => handleClickQuality("Excellent")}
              >
                Excellent
              </button>
            </div>
          </div>
          <div className="text-xs lg:text-base  pt-4 pb-1">Dimension </div>
          <div className="flex">
            <div className="border rounded-3xl flex py-1">
              <button
                className={`text-xs lg:text-base border rounded-2xl border-transparent w-20 px-2 py-1 mx-1 ${
                  selectedDimension === "2D" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleClickDimension("2D")}
              >
                2D
              </button>
              <button
                className={`text-xs lg:text-base border rounded-2xl border-transparent w-20 px-2 py-1 mx-1 ${
                  selectedDimension === "3D" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleClickDimension("3D")}
              >
                3D
              </button>
            </div>
          </div>
          <div className="text-xs lg:text-base pt-4 pb-1">Shape </div>
          <div className="flex">
            <div className="border rounded-3xl flex py-1">
              <button
                className={`text-xs lg:text-base border rounded-2xl border-transparent w-20 lg:w-28 px-2 py-1 mx-1 ${
                  selectedShape === "Square" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleClickShape("Square")}
              >
                Square
              </button>
              <button
                className={`text-xs lg:text-base border rounded-2xl border-transparent w-20 lg:w-28 px-2 py-1 mx-1 ${
                  selectedShape === "Horizontal" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleClickShape("Horizontal")}
              >
                Horizontal
              </button>
              <button
                className={`text-xs lg:text-base border rounded-2xl border-transparent w-20 lg:w-28 px-2 py-1 mx-1 ${
                  selectedShape === "Vertical" ? "bg-blue-500 text-white" : ""
                }`}
                onClick={() => handleClickShape("Vertical")}
              >
                Vertical
              </button>
            </div>
          </div>
          {!isLoading ? (
            <button onClick={generateImage} className="button-76 mt-8">
              Generate
            </button>
          ) : (
            <div className="loader mt-8"></div>
          )}
        </div>
        <div className="pt-10 lg:pt-0 lg:w-2/3">
          <div className="flex justify-center">
            <img src={imageUrl} className="w-5/6 lg:w-3/4 rounded-3xl"></img>
          </div>
        </div>
      </div>
    </div>
  );
}
