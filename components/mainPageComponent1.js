export default function MainPageComponent1() {
  return (
    <div>
      <div className="flex flex-row justify-center pt-10">
        <img src="/images/logo/CreatAILogoText.png" className="w-1/2"></img>
      </div>
      <div className="flex items-center justify-center pt-10">
      <input
        type="text"
        placeholder="Generate your Image"
        className="text-white opacity-50 w-1/4 font-thin bg-black px-4 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button className="button-36 mx-2">Generate</button>
    </div>
    </div>
  );
}
