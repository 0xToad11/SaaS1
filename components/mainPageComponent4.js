import React, { useState, useEffect } from "react";

const emailText =
  "I hope this email finds you well. It's been a while since we last caught up, and I'd love to hear how things are going with you. Let's schedule a time to chat soon.";

const TypingEffect = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      setIndex((prev) => prev + 1);
    }, 100); // Adjust the speed of typing here (100ms per character)

    if (index === text.length) {
      clearInterval(typingInterval);
      setTimeout(() => {
        setDisplayedText("");
        setIndex(0);
      }, 2000); // Adjust the delay before restarting the typing effect
    }

    return () => clearInterval(typingInterval);
  }, [index, text]);

  return <div>{displayedText}</div>;
};

export default function MainPageComponent4() {
  return (
    <div className="pt-24 lg:pt-60">
      <div className="flex">
        <div className="w-1/3 pt-24 lg:pt-32 ml-6 lg:ml-48">
          <div className="text-2xl lg:text-4xl font-semibold">E-mail Replier</div>
          <div className="text-xs lg:text-sm pt-2  text-slate-400 w-5/6">
            Type roughly what you want to say in your e-mail and the AI will
            make it a full fledged e-mail.
          </div>
          <div className="mt-2 lg:mt-4">
            <button className="button-34 hover:opacity-90">
              E-mail replier
            </button>
          </div>
        </div>
        <div className="w-1/3 pt-24 lg:pt-32 justify-center">
          <div className="w-40 lg:w-72 text-xs lg:text-base p-2 border rounded-xl shadow-md shadow-slate-500 text-slate-500 border-slate-500">
            Subject: Quick Catch-Up!
          </div>
          <div className="w-48 lg:w-80 text-xs lg:text-base h-36 lg:h-48 p-2 border rounded-xl shadow-lg shadow-slate-500 text-slate-500 border-slate-500 mt-4">
            <div>Hi [Recipient's Name], </div>
            <br></br>
            <TypingEffect text={emailText} />
          </div>
        </div>
      </div>
    </div>
  );
}
