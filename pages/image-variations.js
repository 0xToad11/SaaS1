import React, { useState } from "react";
import axios from "axios";

export default function ImageVariations() {
  const [imageVariation, setImageVariation] = useState(null);
  const [imageUrlVariation, setImageUrlVariation] = useState(
    "/images/mainpage/DogVariation1.png"
  );
  const [isLoading, setIsLoading] = useState(false); // State for loader

  const handleImageChange = (e) => {
    setImageVariation(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!imageVariation) {
      alert("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageVariation);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/generate-variation",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImageUrlVariation(response.data.imageUrlVariation);
    } catch (error) {
      console.error("Error generating image variation:", error);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  return (
    <div>
      <div className="text-center text-3xl font-semibold pt-10 ">
        Image Variation
      </div>
      <div className="lg:flex pt-6 lg:pt-20">
        <div className="lg:w-1/3 pl-2 lg:pl-20 border pt-2 lg:pt-8 pb-6 lg:pb-12 rounded-xl border-slate-500 ml-6 mr-6 lg:mr-0 lg:ml-20 text-slate-200">
          <div className="py-2">Create image variations from your image</div>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/png"
              onChange={handleImageChange}
              className="border-2"
            />
            {!isLoading ? (
              <button type="submit" className="button-76 mt-4 lg:mt-8">
                Generate
              </button>
            ) : (
              <div className="loader mt-8"></div>
            )}
          </form>
        </div>
        <div className="lg:w-2/3 pt-6 lg:pt-0">
          <div className="flex justify-center">
            <img src={imageUrlVariation} className="w-5/6 lg:w-3/4  rounded-3xl"></img>
          </div>
        </div>
      </div>
    </div>
  );
}
