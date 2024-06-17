export default function Footer() {
  return (
    <div id="footer" className="pt-4 sm:pt-20">
      <div className="flex flex-row justify-center text-xs sm:text-xs xl:text-sm text-slate-200">
        <a
          className="px-2 hover:opacity-90"
          href="/TermsOfService"
        >
          Terms Of Service
        </a>
        <a
          className="px-2 hover:opacity-90"
          href="/PrivacyPolicy"
        >
          Privacy Policy
        </a>
      </div>
      <div className="text-center pb-1 text-xs sm:text-xs xl:text-sm text-slate-500">
        © 2024 All Rights Reserved. CreatAI
      </div>
    </div>
  );
}
