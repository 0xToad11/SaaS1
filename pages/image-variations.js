import React, { useState, useEffect } from "react";
import axios from "axios";
import supabase from "/config/supabaseConfig";
import { useUser } from "@clerk/nextjs";

export default function ImageVariations({ sessionId, credits, setCredits }) {
  const [imageVariation, setImageVariation] = useState(null);
  const [imageUrlVariation, setImageUrlVariation] = useState("/images/mainpage/DogVariation1.png");
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // State for subscription status
  const { user } = useUser(); // Get the authenticated user

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("subscription")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Error fetching subscription status:", error);
        } else {
          setSubscriptionStatus(data.subscription);
        }
      }
    };

    if (user) {
      fetchSubscriptionStatus();
    }
  }, [user]);

  const handleImageChange = (e) => {
    setImageVariation(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user && credits <= 0) {
      alert("No credits left. Please purchase more credits to continue.");
      return;
    }

    if (user && subscriptionStatus !== "active") {
      alert("Your subscription is not active. Please subscribe to continue.");
      return;
    }

    setIsLoading(true);

    if (!imageVariation) {
      alert("Please upload an image");
      setIsLoading(false);
      return;
    }

    const maxSizeInBytes = 500 * 1024; // 500KB in bytes
    if (imageVariation.size > maxSizeInBytes) {
      alert("Image size too big, max size 0.5MB");
      setIsLoading(false);
      return;
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageVariation);
    fileReader.onloadend = async () => {
      const base64Image = fileReader.result.split(',')[1]; // Get base64 string

      try {
        const { data } = await axios.post('/api/upload-to-imgur', { imageBase64: base64Image });

        const imageUrl = data.imageUrl;

        const variationResponse = await axios.post('/api/generate-variation', { imageUrl });

        setImageUrlVariation(variationResponse.data.variationUrl);

        if (!user) {
          // Decrement credits locally
          setCredits(credits - 1);

          // Update credits in the database
          const { error } = await supabase
            .from("SessionDB")
            .update({ credits: credits - 1 })
            .eq("session_id", sessionId);

          if (error) {
            console.error("Error decrementing credits:", error);
          }
        }

      } catch (error) {
        console.error("Error generating image variation:", error);
        alert("Error generating image variation");
      } finally {
        setTimeout(() => {
          setIsLoading(false); // Hide loader after 1 seconds
        }, 1000); // 1000 milliseconds = 1 seconds
      }
    };

    fileReader.onerror = () => {
      console.error('Error reading file');
      alert('Error reading file');
      setIsLoading(false);
    };
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
          <div className="mt-4 text-xs lg:text-base">
            {user
              ? subscriptionStatus === "invalid" && (
                  <a href="/account">
                    <button className="button-29-sub mt-4">Subscribe</button>
                  </a>
                )
              : `Credits: ${credits}`}
          </div>
        </div>
        <div className="lg:w-2/3 pt-6 lg:pt-0">
          <div className="flex justify-center">
            <img
              src={imageUrlVariation}
              className="w-5/6 lg:w-3/4 rounded-3xl"
            ></img>
          </div>
        </div>
      </div>
    </div>
  );
}
