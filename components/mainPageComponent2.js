export default function MainPageComponent2() {
  return (
    <div className="pt-80">
      <div className="flex">
        <div className="w-1/3 pt-32">
          <div className="text-4xl font-semibold pl-48">Image Generator</div>
          <div className="text-sm pt-2 pl-48 text-slate-400 w-5/6">
            Enter a prompt, pick an art style and CreatAI will bring your idea
            to life.
          </div>
          <div className="ml-48 mt-4">
            <button onClick={() => window.location.href = '/generate-images'} className="button-34 hover:opacity-90">
              Text to Image
            </button>
          </div>
        </div>
        <div className="w-1/3 flex justify-center">
          <img src="/images/mainpage/CatCoupleEating.png" className="w-3/4 border border-transparent rounded-3xl image-scale"></img>
        </div>
        <div className="w-1/3 pt-52">
            {/* <div className="border rounded-md w-72 border-slate-400 text-slate-500 font-thin px-2">
            'Cute anthropomorphic cats in 3D style, eating spaghetti with tomato sauce in their home at their dinner table. Square aspect ratio'
            </div> */}
        </div>
      </div>
    </div>
  );
}
