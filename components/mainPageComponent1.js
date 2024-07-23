export default function MainPageComponent1() {
  return (
    <div>
      <div className="flex flex-row justify-center pt-10 fade-in-animation-2s">
        <img src="/images/logo/CreatAILogoText3.png" className="w-full lg:w-5/6"></img>
      </div>
      <div className="flex items-center justify-center pt-2 lg:pt-10 fade-in-animation-2s">
      <input
        type="text"
        placeholder="Generate your Image"
        className="text-white text-xs lg:text-base opacity-50 w-1/2 lg:w-1/4 font-thin bg-black px-4 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button onClick={() => window.location.href = '/generate-images'} className="button-36 mx-2">Generate</button>
    </div>
    <div className="text-center text-xl lg:text-4xl pt-12 lg:pt-20 font-bold text-gray-700 max-w-4xl mx-auto text-oneliner">
  Empowering businesses and content creators with essential tools for marketing and creativity
</div>
    </div>
  );
}
