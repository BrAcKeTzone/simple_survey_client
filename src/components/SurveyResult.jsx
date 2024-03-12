import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoReturnDownBackSharp } from "react-icons/io5";
import API from "./api";
import { questionsData } from "./questionsData";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const SurveyResult = () => {
  const [surveyResults, setSurveyResults] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gender, setGender] = useState("");
  const [trendData, setTrendData] = useState([]);
  const [resultCount, setResultCount] = useState(0)

  useEffect(() => {
    const fetchSurveyResults = async () => {
      try {
        const response = await API.get("/survey/review", {
          params: { startDate, endDate, gender },
        });
        setResultCount(response.data.length)
        setSurveyResults(response.data);
        setTrendData(
          response.data.reduce((acc, result) => {
            const date = new Date(result.createdAt).toLocaleDateString();
            if (!acc[date]) {
              acc[date] = 0;
            }
            acc[date] += 1;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error fetching survey results:", error);
        alert("Retrieving data failed, please reload the page!");
      }
    };
    fetchSurveyResults();
  }, [startDate, endDate, gender]);

  const getColorHexCode = (index) => {
    const colors = [
      "#ff0000", // Red
      "#0000ff", // Blue
      "#00ff00", // Green
      "#ffff00", // Yellow
      "#800080", // Purple
      "#ff69b4", // Pink
      "#4b0082", // Indigo
      "#008080", // Teal
      "#808080", // Gray
      "#ffa500", // Orange
    ];
    return colors[index % colors.length];
  };

  const getCountForChoice = (questionId, choice) => {
    const resultsForQuestion = surveyResults.filter(
      (result) => result.answers[questionId] === choice
    );
    return resultsForQuestion.length;
  };

  return (
    <div className="bg-purple-100 md:py-8">
      <div className="max-w-3xl mx-auto p-8 bg-gray-100 rounded-lg shadow-md border-t-8 border-purple-300">
        <div className="flex flex-col mb-4">
          <h1 className="text-4xl mb-4">Survey Results</h1>
          <Link
            to="/"
            className="flex flex-row text-blue-500 hover:underline mb-2"
          >
            <IoReturnDownBackSharp className="text-2xl" /> Back to Survey
          </Link>
          <div className="flex flex-col md:flex-row justify-between mt-4">
            <div className="flex items-center">
              <label htmlFor="gender" className="mr-2 w-full md:w-auto">
                Gender:
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </div>
            <div className="flex items-center">
              <label htmlFor="startDate" className="mr-2 w-full md:w-auto">
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="endDate" className="mr-2 w-full md:w-auto">
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Trend Over Time</h2>
          <div className=" overflow-x-auto">
            <LineChart
              width={600}
              height={400}
              data={Object.entries(trendData).map(([date, count]) => ({
                date,
                count,
              }))}
            >
              <XAxis dataKey="date" />
              <YAxis domain={[0, 50]} ticks={[0, 10, 20, 30, 40, 50]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
              <Tooltip />
            </LineChart>
          </div>
        </div>
        {questionsData.map((question) => (
          <div key={question.id} className="mb-8 p-2 rounded">
            <p className="text-lg font-semibold text-gray-800">
              {question.question_text}
            </p>
            <div className="grid grid-cols-1">
              <div className="flex flex-row flex-wrap">
                {question.choice_selections.map((choice, index) => (
                  <div key={index} className="flex items-center mb-2 mr-4">
                    <div
                      style={{
                        width: "1rem",
                        height: "1rem",
                        marginRight: "0.5rem",
                        backgroundColor: getColorHexCode(index),
                      }}
                    ></div>
                    <span>{choice}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col md:flex-row justify-center items-center border border-black">
                <div className="w-full flex justify-center">
                  <PieChart width={200} height={200}>
                    <Pie
                      data={question.choice_selections.map((choice, index) => ({
                        name: choice,
                        value: getCountForChoice(question.id, choice),
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {question.choice_selections.map((choice, index) => (
                        <Cell key={index} fill={getColorHexCode(index)} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
                <div className="mt-4 md:mt-0 px-6 flex flex-col w-full md:border-l md:border-black md:px-8">
                  <hr className="h-[2px] bg-black md:hidden" />
                  <span className="font-bold mb-2 text-sm">Response Percentage from <em>{resultCount}</em> participants:</span>
                  {question.choice_selections.map((choice, index) => (
                    <div key={index} className="mb-1 text-left md:text-left">
                      <em className="text-sm">{`${choice}:`}</em>{" "}
                      <strong>{`${
                        isNaN(
                          (getCountForChoice(question.id, choice) /
                            surveyResults.length) *
                            100
                        )
                          ? "0%"
                          : `${Math.round(
                              (getCountForChoice(question.id, choice) /
                                surveyResults.length) *
                                100
                            )}%`
                      }`}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurveyResult;
