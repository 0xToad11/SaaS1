import React, { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div className="flex justify-between pt-2 sm:pt-6 mx-2 sm:mx-12 mb-10 slide-in-top-animation">
      <a href="/">
        <div className="flex items-center hover:opacity-80 w-16 sm:w-28">
          <img
            src="/images/logo/LogoCreatAI1.png"
            alt="Your Logo"
            style={imageStyle}
          />
        </div>
      </a>
      <div className="roboto-font font-semibold mt-2 sm:mt-5 xl:mt-6 hidden lg:block">
        <a
          className="p-2 xl:p-4 mx-2 sm:mx-4 xl:mx-6 text-xs md:text-lg xl:text-2xl hover:opacity-80"
          href="/"
        >
          Home
        </a>
        <a
          className="p-2 xl:p-4 mx-2 sm:mx-4 xl:mx-6 text-xs md:text-lg xl:text-2xl hover:opacity-80"
          href="/Generate-images"
        >
          Generate Images
        </a>
        
        <a
          className="text-xs md:text-lg xl:text-2xl border-2 sm:border-4 rounded-3xl p-2 xl:p-2 mx-2 sm:mx-4 xl-mx-6 hover:bg-white hover:text-black"
          href="/"
        >
          Sign in
        </a>
      </div>
      <div className="block lg:hidden">
        <img
          src="/images/header/MenuLogo.jpg"
          alt="Menu Icon"
          onClick={toggleMenu}
          className="cursor-pointer mt-2 mr-2 sm:mt-4 w-8 sm:w-12"
        />
        {menuOpen && (
          <div className="absolute top-18 sm:top-32 right-0 bg-black w-full text-center my-4 shadow-md z-10">
            <a href="/" className="block p-2 border-b border-gray-200">
              Home
            </a>
            <a href="/Generate-images" className="block p-2 border-b border-gray-200">
              Generate Images
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------- inline CSS -----------------------------------------------------------------------

const imageStyle = {
  borderRadius: "0%", // Make the border round
};
