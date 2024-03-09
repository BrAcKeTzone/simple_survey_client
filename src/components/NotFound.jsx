import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4">
      <div className="text-4xl md:text-6xl font-bold mb-4 text-center">
        404 Not Found
      </div>
      <p className="text-base md:text-lg mb-8 text-center">
        Oops! The page you're looking for does not exist.
      </p>
      <img
        src="https://i.imgur.com/qIufhof.png"
        alt="Lost Astronaut"
        className="w-full md:w-96 h-auto mb-8"
      />
      <Link
        to="/"
        className="text-base md:text-lg underline hover:text-gray-300 text-center"
      >
        Go back to survey
      </Link>
    </div>
  );
};

export default NotFound;
