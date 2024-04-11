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
  const [resultCount, setResultCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [enlargedChartIndex, setEnlargedChartIndex] = useState(null); // Track which PieChart is enlarged

  useEffect(() => {
    const fetchSurveyResults = async () => {
      try {
        setIsLoading(true);
        const response = await API.get("/survey/review", {
          params: { startDate, endDate, gender },
        });
        setResultCount(response.data.length);
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
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching survey results:", error);
        alert("Retrieving data failed, please reload the page!");
      } finally {
        setIsLoading(false);
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
      "#800000", // Maroon
    ];
    return colors[index % colors.length];
  };

  const getCountForChoice = (questionId, choice) => {
    const resultsForQuestion = surveyResults.filter((result) => {
      const answer = result.answers[questionId];
      if (Array.isArray(answer)) {
        return answer.includes(choice);
      } else {
        return answer === choice;
      }
    });

    return resultsForQuestion.length;
  };

  // Function to toggle enlargement of PieChart
  const toggleEnlargement = (index) => {
    if (enlargedChartIndex === index) {
      setEnlargedChartIndex(null); // If already enlarged, close it
    } else {
      setEnlargedChartIndex(index); // Otherwise, enlarge the PieChart at the specified index
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen bg-white bg-opacity-20">
          <span className="loader" />
        </div>
      ) : (
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
              <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
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
                  <YAxis domain={[0, 30]} ticks={[0, 5, 10, 15, 20, 25, 30]} />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                  <Tooltip />
                </LineChart>
              </div>
            </div>
            {questionsData.map(
              (
                question,
                index // Added index parameter for mapping
              ) => (
                <div key={question.id} className="mb-8 p-2 rounded">
                  <p className="text-lg font-semibold text-gray-800">
                    {question.question_text}
                  </p>
                  <div className="grid grid-cols-1">
                    <div className="flex flex-col md:flex-row flex-wrap">
                      {question.choice_selections.map((choice, index) => (
                        <div
                          key={index}
                          className="flex items-center mb-2 mr-4"
                        >
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
                    <div
                      className="flex flex-col md:flex-row justify-center items-center border border-black"
                      onClick={() => toggleEnlargement(index)} // Toggle enlargement on click
                      style={{ cursor: "pointer" }} // Add pointer cursor
                    >
                      <div className="w-full flex justify-center">
                        <PieChart width={300} height={300}>
                          <Pie
                            data={question.choice_selections.map(
                              (choice, index) => ({
                                name: choice,
                                value: getCountForChoice(question.id, choice),
                              })
                            )}
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
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
                      <div className="my-4 px-6 flex flex-col w-full md:border-l md:border-black md:px-8">
                        <hr className="h-[2px] bg-black md:hidden" />
                        <span className="font-bold mb-2 text-sm">
                          Response Percentage from <em>{resultCount}</em>{" "}
                          participants:
                        </span>
                        {question.choice_selections.map((choice, index) => (
                          <div key={index} className="flex justify-between">
                            <em className="text-sm">{`${choice}:`}</em>{" "}
                            <strong>{`${
                              isNaN(
                                (getCountForChoice(question.id, choice) /
                                  surveyResults.length) *
                                  100
                              )
                                ? "0.00%"
                                : `${Math.round(
                                    (getCountForChoice(question.id, choice) /
                                      surveyResults.length) *
                                      100
                                  ).toFixed(2)}%`
                            }`}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="hidden md:block">
                      {enlargedChartIndex === index && (
                        <div className="flex fixed top-0 left-0 z-50 w-full h-screen bg-gray-900 bg-opacity-75 justify-center items-center">
                          <div className="bg-white p-4 rounded-lg relative">
                            <PieChart width={600} height={400}>
                              <Pie
                                data={question.choice_selections.map(
                                  (choice, index) => ({
                                    name: choice,
                                    value: getCountForChoice(
                                      question.id,
                                      choice
                                    ),
                                  })
                                )}
                                cx="50%"
                                cy="50%"
                                outerRadius={180}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {question.choice_selections.map(
                                  (choice, index) => (
                                    <Cell
                                      key={index}
                                      fill={getColorHexCode(index)}
                                    />
                                  )
                                )}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                            <button
                              className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-800"
                              onClick={() => setEnlargedChartIndex(null)}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SurveyResult;
