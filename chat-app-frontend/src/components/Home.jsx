import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4 text-white">
      <div className="text-center space-y-6 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide">
          Welcome to <span className="text-blue-500">Let's Chat 💬</span>
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          Connect, communicate and collaborate — in real time. Whether it's one-on-one or group conversations, 
          <span className="text-white font-semibold"> Let's Chat</span> makes it seamless and secure.
        </p>

        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 transition rounded-lg font-semibold"
          >
            Register
          </Link>
        </div>

        <div className="mt-6 text-sm text-gray-500 italic">
          "Real conversations. Real-time connection."
        </div>
      </div>
    </div>
  );
};

export default Home;
