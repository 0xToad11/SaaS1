export default function MainPageComponent1() {
  return (
    <div>
      <div className="flex flex-row justify-center pt-10 fade-in-animation-2s">
        <img src="/images/logo/CreatAILogoText.png" className="w-5/6 lg:w-1/2"></img>
      </div>
      <div className="flex items-center justify-center pt-2 lg:pt-10 fade-in-animation-2s">
      <input
        type="text"
        placeholder="Generate your Image"
        className="text-white text-xs lg:text-base opacity-50 w-1/2 lg:w-1/4 font-thin bg-black px-4 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button className="button-36 mx-2">Generate</button>
    </div>
    </div>
  );
}
