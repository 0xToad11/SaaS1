export default function Footer() {
  return (
    <div id="footer" className="pt-20 lg:pt-32">
      <div className="flex flex-row justify-center items-center pt-2">
        <div className="flex flex-row justify-center items-center pt-2">
          <a
            className="text-sm my-1 mx-4 hover:text-slate-300"
            href="https://x.com/ContactCreatAI"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="w-6 h-6 hover:opacity-80"
              src="images/footer/twitter.png"
            ></img>
          </a>
          <a
            className="text-sm my-1 mx-4 hover:text-slate-300"
            href="mailto:contact@creatai.pro"
          >
            <img
              className="w-10 h-10 hover:opacity-80"
              src="images/footer/mailLogo.png"
              alt="Send Email"
            ></img>
          </a>
          <a
            className="text-sm my-1 mx-4 hover:text-slate-300"
            href="https://www.instagram.com/creatai.pro/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="w-8 h-8 hover:opacity-80"
              src="images/footer/InstagramLogo.png"
            ></img>
          </a>
          <a
            className="text-sm my-1 mx-4 hover:text-slate-300"
            href="https://www.youtube.com/channel/UCGj0tH_Lz_YoAFdHJYEvbFQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="w-10 h-10 hover:opacity-80"
              src="images/footer/YoutubeLogo2.png"
            ></img>
          </a>
          <a
            className="text-sm my-1 mx-4 hover:text-slate-300"
            href="https://www.tiktok.com/@creataipro"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="w-8 h-8 hover:opacity-80"
              src="images/footer/TikTokLogo2.png"
            ></img>
          </a>
        </div>
      </div>
      <div className="flex flex-row justify-center text-xs sm:text-xs xl:text-sm text-slate-200">
        <a className="px-2 hover:opacity-90" href="/TermsOfService">
          Terms Of Service
        </a>
        <a className="px-2 hover:opacity-90" href="/privacy">
          Privacy Policy
        </a>
      </div>
      <div className="text-center pb-1 text-xs sm:text-xs xl:text-sm text-slate-500">
        © 2024 All Rights Reserved. CreatAI
      </div>
    </div>
  );
}
