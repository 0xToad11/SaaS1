import React, { useState, useEffect } from "react";
import axios from "axios";
import supabase from "/config/supabaseConfig";
import { useUser, SignInButton } from "@clerk/nextjs";

export default function GenerateVideos({ sessionId, credits, setCredits }) {
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [prompt, setPrompt] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // State for subscription status
  const [videoUrl, setVideoUrl] = useState(null); // State to store video URL
  const { user } = useUser(); // Get the authenticated user
  const [creditAccount, setCreditAccount] = useState(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("subscription, credit_account")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Error fetching subscription status:", error);
        } else {
          setSubscriptionStatus(data.subscription);
          setCreditAccount(data.credit_account); // Assuming you have a `setCreditAccount` state setter
        }
      }
    };
    fetchSubscriptionStatus();
  }, [user]);

  const handlePromptChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async () => {
    if (!user && credits <= 0) {
      alert(
        "No credits left. Wait 24h to receive new credits or subscribe to have unlimited access."
      );
      return;
    }

    if (user && creditAccount <= 0) {
      alert("No credits left, buy credits to use this tool");
      return;
    }

    setIsLoading(true);
    setVideoUrl(null); // Clear video URL to reset the video player

    try {
      // Example Axios call from the front-end
      const response = await axios.post(
        "https://www.creatai.pro/api/generate-video",
        {
          prompt: prompt, // Dynamic prompt
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const generatedVideoUrl = response.data.videoUrl; // Get the generated video URL
      setVideoUrl(generatedVideoUrl); // Set the video URL to state
      console.log(response.data.videoUrl); // Access the generated video URL

      if (user) {
        // Decrement credits locally
        setCreditAccount(creditAccount - 1);
        // Update credits in the database
        const { error } = await supabase
          .from("users")
          .update({ credit_account: creditAccount - 1 })
          .eq("id", user.id);
        console.log("update credit db of: " + user.id);

        if (error) {
          console.error("Error decrementing credits:", error);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center text-3xl font-semibold pt-10 ">
        Video Generator
      </div>
      <div className="lg:flex pt-6 lg:pt-20">
        <div className="text-xs lg:text-base lg:w-1/3 pl-2 lg:pl-20 border pt-2 lg:pt-8 pb-6 lg:pb-12 rounded-xl border-slate-500 ml-6 lg:ml-20 mr-6 lg:mr-0 text-slate-200">
          <div className=" py-2">Create a video from text prompt</div>
          <div className="flex pb-2"></div>
          <textarea
            className="opacity-50 font-thin bg-slate-800 h-24 w-11/12 lg:w-3/4 px-4 border border-blue-700 shadow-lg shadow-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
            placeholder="Enter your prompt"
            value={prompt}
            onChange={handlePromptChange}
          ></textarea>
          <div className="flex"></div>
          <div className="mt-4 text-xs lg:text-base">
            {user ? (
              // Display `credit_account` and check for subscription status
              <div>
                {!isLoading ? (
                  <button onClick={handleSubmit} className="button-76 mt-8">
                    Generate
                  </button>
                ) : (
                  <div className="loader mt-8"></div>
                )}
                <div className="pt-2 lg:pt-4 pl-1">
                  Your Credits: {creditAccount}
                </div>
              </div>
            ) : (
              // Display for non-logged-in users
              <div>
                <SignInButton>
                  <button className="text-xs md:text-lg xl:text-2xl button-79 my-1">
                    LOGIN TO USE
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/2 pl-6 lg:pl-20 pr-6 lg:pr-0 pt-4 lg:pt-0">
          <div className="flex justify-center"></div>
          {videoUrl && (
            <div className="video-container">
              <video key={videoUrl} width="600" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center lg:flex lg:flex-row lg:justify-center lg:space-x-8 pt-10 lg:pt-20 space-y-4 sm:space-y-0">
        <video className="w-3/4 lg:w-1/4 rounded-xl" controls>
          <source src="/vids/GreenGardenSunShining.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <video className="w-3/4 lg:w-1/4 rounded-xl" controls>
          <source src="/vids/CuteCatsPlayingInHouse.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <video className="w-3/4 lg:w-1/4 rounded-xl" controls>
          <source src="/vids/WaterfallNatureForestAnimalsSunshine.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}
