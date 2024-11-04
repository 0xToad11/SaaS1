import { SignInButton, UserButton } from "@clerk/nextjs";
import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { isSignedIn } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div className="flex justify-between pt-2 mx-2 sm:mx-12 mb-10 slide-in-top-animation">
      <a href="/">
        <div className="flex items-center hover:opacity-80 w-16 sm:w-28">
          <img
            src="/images/logo/LogoCreatAI1.png"
            alt="Your Logo"
            // style={imageStyle}
          />
        </div>
      </a>
      <div className="roboto-font font-semibold mt-2 hidden lg:block">
        <a
          className="p-2 xl:p-4 mx-2 sm:mx-4 xl:mx-6 text-xs md:text-lg xl:text-2xl hover:opacity-80"
          href="/generate-images"
        >
          Generate Images
        </a>
        <a
          className="p-2 xl:p-4 mx-2 sm:mx-4 xl:mx-6 text-xs md:text-lg xl:text-2xl hover:opacity-80"
          href="/image-variations"
        >
          Image Variations
        </a>
        <a
          className="p-2 xl:p-4 mx-2 sm:mx-4 xl:mx-6 text-xs md:text-lg xl:text-2xl hover:opacity-80"
          href="/generate-videos"
        >
          Generate Videos
        </a>
        <a
          className="p-2 xl:p-4 mx-2 sm:mx-4 xl:mx-6 text-xs md:text-lg xl:text-2xl hover:opacity-80"
          href="/email-replier"
        >
          E-mail replier
        </a>
        {isSignedIn ? (
          <a href="/account">
                        <button className="relative" style={{ top: '20px' }}>
              <img
                src="/images/header/AccountIconWhite.png"
                alt="Your Logo"
                className="w-14"
              />
            </button>
          </a>
        ) : (
          <SignInButton>
            <button className="text-xs md:text-lg xl:text-2xl button-79">
              Sign in
            </button>
          </SignInButton>
        )}
      </div>
      <div className="block lg:hidden">
        <img
          src="/images/header/menuBar.png"
          alt="Menu Icon"
          onClick={toggleMenu}
          className="cursor-pointer mt-2 mr-2 sm:mt-4 w-8 sm:w-12"
        />
        {menuOpen && (
          <div className="absolute top-18 sm:top-32 right-0 bg-black bg-opacity-70 w-full text-center my-4 shadow-md z-10">
            <a
              href="/generate-images"
              className="block p-2 border-b border-gray-200"
            >
              Generate Images
            </a>
            <a
              href="/image-variations"
              className="block p-2 border-b border-gray-200"
            >
              Image Variations
            </a>
            <a
              href="/email-replier"
              className="block p-2 border-b border-gray-200"
            >
              E-mail replier
            </a>
            {isSignedIn ? (
              <div className="my-1">
                <a href="/account">
                  <button>
                    <img
                      src="/images/header/AccountIconWhite.png"
                      alt="Your Logo"
                      className="w-14"
                    />
                  </button>
                </a>
              </div>
            ) : (
              <SignInButton>
                <button className="text-xs md:text-lg xl:text-2xl button-79 my-1">
                  Sign in
                </button>
              </SignInButton>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------- inline CSS -----------------------------------------------------------------------

// const imageStyle = {
//   borderRadius: "0%", // Make the border round

// };
