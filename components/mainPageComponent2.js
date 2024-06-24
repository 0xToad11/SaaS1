export default function MainPageComponent2() {
  return (
    <div className="pt-12 lg:pt-80">
      <div className="flex">
        <div className="w-1/2 lg:w-1/3 pt-32">
          <div className="text-2xl lg:text-4xl font-semibold pl-6 lg:pl-48">Image Generator</div>
          <div className="text-xs lg:text-sm pt-2 pl-6 lg:pl-48 text-slate-400 w-5/6">
            Enter a prompt, pick an art style and CreatAI will bring your idea
            to life.
          </div>
          <div className="ml-6 lg:ml-48 mt-2 lg:mt-4">
            <button onClick={() => window.location.href = '/generate-images'} className="button-34 hover:opacity-90">
              Text to Image
            </button>
          </div>
        </div>
        <div className="w-1/2 h-1/2 lg:w-1/3 lg:h-1/3 flex justify-center">
          <img src="/images/mainpage/CatCoupleEating.png" className="mt-32 lg:mt-0 mr-6 border border-transparent rounded-3xl image-scale"></img>
        </div>
      </div>
    </div>
  );
}
