import React, { useState, useEffect } from "react";
import axios from "axios";
import supabase from "/config/supabaseConfig";
import { useUser } from "@clerk/nextjs";

export default function EmailReplier({ sessionId, credits, setCredits }) {
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [to, setTo] = useState("");
  const [prompt, setPrompt] = useState("");
  const [selectedTone, setSelectedTone] = useState("Formal"); // Set 'Formal' as default
  const [responseMessage, setResponseMessage] = useState(
    `Subject: Example mail \n\nHello Tom, \n\nThanks for using CreatAI. \n\nKind regards, \n\nCreatAI`
  );
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
    fetchSubscriptionStatus();
  }, [user]);

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
    if (!user && credits <= 0) {
      alert("No credits left. Please purchase more credits to continue.");
      return;
    }

    if (user && subscriptionStatus !== "active") {
      alert("Your subscription is not active. Please subscribe to continue.");
      return;
    }

    setIsLoading(true);
    const combinedPrompt = `type ${selectedTone} e-mail to ${to} about ${prompt}`;

    try {
      const response = await axios.post(
        "https://saas1-five.vercel.app/api/generate-email-reply",
        {
          prompt: combinedPrompt,
        }
      );
      console.log("Response:", response.data);
      setResponseMessage(response.data.reply);

      // if (!user) {
        // Decrement credits locally
        setCredits(credits - 1);
        print("new credits" + credits);
        // Update credits in the database
        const { error } = await supabase
          .from("SessionDB")
          .update({ credits: credits - 1 })
          .eq("session_id", sessionId);
          console.log("update credit db");

        if (error) {
          console.error("Error decrementing credits:", error);
        // }
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
        E-mail Replier
      </div>
      <div className="lg:flex pt-6 lg:pt-20">
        <div className="text-xs lg:text-base lg:w-1/3 pl-2 lg:pl-20 border pt-2 lg:pt-8 pb-6 lg:pb-12 rounded-xl border-slate-500 ml-6 lg:ml-20 mr-6 lg:mr-0 text-slate-200">
          <div className=" py-2">Create an E-mail reply</div>
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
            className="opacity-50 font-thin bg-slate-800 h-24 w-11/12 lg:w-3/4 px-4 border border-blue-700 shadow-lg shadow-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
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

        <div className="lg:w-1/2 pl-6 lg:pl-20 pr-6 lg:pr-0 pt-4 lg:pt-0">
          <div className="flex justify-center"></div>
          {responseMessage && (
            <div className="text-xs lg:text-base p-4 border rounded-xl border-slate-500 bg-slate-800 text-slate-200 whitespace-pre-wrap">
              <p>{responseMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
