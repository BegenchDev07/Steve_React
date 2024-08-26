import { useState } from "react";

const DEFAULT_ENGINE_URL =
  "https://api.keanu.plus/engine/keanu?outline=true&project=movie/abc&palette=true";

const Dashboard = () => {
  const [engineURL, setEngineURL] = useState(DEFAULT_ENGINE_URL);
  const openInEngineHandler = () => {
    window.open(engineURL, "_blank");
  };

  return (
    <div className="w-full bg-gray-100 shadow-md rounded-lg overflow-hidden relative">
      <div
        className="h-64 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://keanu-1302931958.cos.ap-beijing.myqcloud.com/keanuStatic/game-sim.jpeg')",
        }}
      >
        <button
          onClick={openInEngineHandler}
          className="px-4 py-2 bg-blue-600 text-white absolute top-4 right-4 rounded-lg transition duration-300 hover:bg-blue-700 hover:shadow-xl"
        >
          Open in Engine
        </button>
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Welcome to Codesk GameHub</div>
        <p className="text-gray-700 text-base">
          Play with this demo in Gamehub Engine.
        </p>
      </div>
      <div className="flex justify-end px-6 pb-4">
        <a
          href="https://api.keanu.plus/engine/keanu?project=jimmy/game&outline=true&palette=true&replay=test&history=true"
          target="_blank"
          className="no-underline bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 px-4 py-2 rounded-lg text-white"
        >
          Tutorial
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
