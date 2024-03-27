import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import API from "./api";
import { surveyAbout } from "./surveyAbout";
import { questionsData } from "./questionsData";

const SurveyForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    fullname: "",
    age: "",
    gender: "",
    answers: questionsData.reduce((acc, question) => {
      acc[question.id] = question.selectionType === "multiple" ? [] : "";
      return acc;
    }, {}),
  };

  const validationSchema = Yup.object().shape({
    fullname: Yup.string().required("Required"),
    age: Yup.number()
      .required("Required")
      .positive("Age must be a positive number"),
    gender: Yup.string().required("Required"),
  });

  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { setFieldError }) => {
    const unanswered = questionsData.filter(
      (question) => !values.answers[question.id]
    );
    if (unanswered.length > 0) {
      setUnansweredQuestions(unanswered.map((q) => q.id));
      unanswered.forEach((question) => {
        setFieldError(`answers[${question.id}]`, "Answer is required");
      });
    } else {
      const shouldSubmit = window.confirm("Are you sure you want to submit?");
      if (shouldSubmit) {
        try {
          setIsSubmitting(true);
          setUnansweredQuestions([]);
          const response = await API.post("/survey/save", values);
          if (response.status === 201) {
            alert("Thank you for participating!");
            navigate("/result");
          }
          // console.log(values);
        } catch (error) {
          console.error("Error saving survey response:", error);
          alert("Submission failed, please try again!");
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const handleQuestionClick = (questionId) => {
    setUnansweredQuestions((prevUnanswered) =>
      prevUnanswered.filter((id) => id !== questionId)
    );
  };

  return (
    <>
      {isSubmitting ? (
        <div className="flex items-center justify-center h-screen bg-white bg-opacity-20">
          <span className="loader" />
        </div>
      ) : (
        <div className="bg-purple-100 md:py-8">
          <div className="max-w-3xl mx-auto p-8 bg-gray-100 rounded-lg shadow-md border-t-8 border-purple-300">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <>
                  <div className="flex flex-col mb-4">
                    <h1 className="text-4xl mb-4">{surveyAbout.surveyTitle}</h1>
                    <p className="mb-4">{surveyAbout.surveyInstruction}</p>
                    <span className="text-red-500"> * Required</span>
                  </div>
                  <Form>
                    <div className="mb-6 flex flex-wrap">
                      <div className="w-full md:w-1/3 md:pr-4">
                        <label
                          htmlFor="fullname"
                          className="block mb-2 text-lg font-semibold text-gray-800"
                        >
                          What is your name?
                          <span className="text-red-500"> *</span>
                        </label>
                        <Field
                          type="text"
                          id="fullname"
                          name="fullname"
                          className={`border ${
                            errors.fullname && touched.fullname
                              ? "border-red-500"
                              : "border-gray-400"
                          } rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500`}
                        />
                        <ErrorMessage
                          name="fullname"
                          component="div"
                          className="text-red-500 mt-1 text-sm"
                        />
                      </div>
                      <div className="w-full md:w-2/3 flex flex-wrap md:flex-no-wrap md:items-center">
                        <div className="w-full md:w-1/2 md:pr-2 mb-2 md:mb-0">
                          <label
                            htmlFor="age"
                            className="block mb-2 text-lg font-semibold text-gray-800"
                          >
                            How old are you?
                            <span className="text-red-500"> *</span>
                          </label>
                          <Field
                            type="number"
                            id="age"
                            name="age"
                            min="18"
                            max="120"
                            className={`border ${
                              errors.age && touched.age
                                ? "border-red-500"
                                : "border-gray-400"
                            } rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500`}
                          />
                          <ErrorMessage
                            name="age"
                            component="div"
                            className="text-red-500 mt-1 text-sm"
                          />
                        </div>
                        <div className="w-full md:w-1/2 md:pl-2">
                          <label
                            htmlFor="gender"
                            className="block mb-2 text-lg font-semibold text-gray-800"
                          >
                            Select your gender
                            <span className="text-red-500"> *</span>
                          </label>
                          <Field
                            as="select"
                            id="gender"
                            name="gender"
                            className={`border ${
                              errors.gender && touched.gender
                                ? "border-red-500"
                                : "border-gray-400"
                            } rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500`}
                          >
                            <option value=""></option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                          </Field>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="text-red-500 mt-1 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {questionsData.map((question) => (
                      <div
                        key={question.id}
                        className={`mb-8 p-2 rounded ${
                          unansweredQuestions.includes(question.id)
                            ? "bg-red-100"
                            : ""
                        }`}
                      >
                        <p className="text-lg font-semibold text-gray-800">
                          {question.question_text}
                          {question.selectionType === "multiple" && (
                            <span className="text-xs text-gray-600 ml-1">
                              (Multiple Answers Allowed)
                            </span>
                          )}
                          <span className="text-red-500"> *</span>
                        </p>
                        {unansweredQuestions.includes(question.id) && (
                          <div className="text-red-500 mb-2 text-sm">
                            Required
                          </div>
                        )}
                        <div>
                          {question.choice_selections.map((choice, index) => (
                            <div
                              key={index}
                              className="flex items-center mb-2"
                              onClick={() => handleQuestionClick(question.id)}
                            >
                              <Field
                                type={
                                  question.selectionType === "multiple"
                                    ? "checkbox"
                                    : "radio"
                                }
                                id={`choice_${question.id}_${index}`}
                                name={`answers[${question.id}]`}
                                value={choice}
                                className="mr-2"
                              />
                              <label htmlFor={`choice_${question.id}_${index}`}>
                                {choice}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Submit
                    </button>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};
export default SurveyForm;
