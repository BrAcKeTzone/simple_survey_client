import React from "react";
import { Link } from "react-router-dom";
import { questionsData } from "./questionsData";
import { surveyResults } from "./surveyResults";

const SurveyResult = () => {
  const getColorClass = (index) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-gray-500",
      "bg-orange-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-purple-100 md:py-8">
      <div className="max-w-3xl mx-auto p-8 bg-gray-100 rounded-lg shadow-md border-t-8 border-purple-300">
        <div className="flex flex-col mb-4">
          <h1 className="text-4xl mb-4">Survey Results</h1>
          <Link to="/" className="text-blue-500 hover:underline mb-2">
            Back to Survey
          </Link>
        </div>
        {questionsData.map((question) => (
          <div key={question.id} className="mb-8 p-2 rounded">
            <p className="text-lg font-semibold text-gray-800">
              {question.question_text}
            </p>
            <div className="grid grid-cols-2">
              <div className="flex flex-col">
                {question.choice_selections.map((choice, index) => (
                  <div key={index} className="flex items-center mb-2 mr-4">
                    <div
                      className={`w-4 h-4 mr-2 ${getColorClass(index)}`}
                    ></div>
                    <span>{choice}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center border border-black">
                Pie chart should be here
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyResult;
