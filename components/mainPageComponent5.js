import React, { useState, useEffect } from "react";

export default function MainPageComponent5() {
  return (
    <div className="pt-24 lg:pt-60">
      <div className="flex">
        <div className="w-0 ml-6 lg:ml-0 lg:w-1/3"></div>

        <div className="w-1/2 lg:w-1/3 pt-12 lg:pt-32">
          <div className="text-2xl lg:text-4xl font-semibold">
            Video Generator
          </div>
          <div className="text-xs lg:text-sm pt-2 text-slate-400 w-5/6">
            Describe your vision, and CreatAI will create your video.
          </div>
          <div className="mt-2 lg:mt-4">
            <button
              onClick={() => (window.location.href = "/generate-videos")}
              className="button-34 hover:opacity-90"
            >
              Text to Video
            </button>
          </div>
        </div>
        <div className="mt-8 lg:mt-24 w-3/12">
          <video className="w-full rounded-lg" controls playsInline muted>
            <source src="/vids/GreenGardenSunShining.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
