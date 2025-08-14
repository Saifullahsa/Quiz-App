import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/solid";

type Type = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

function Question() {
  const location = useLocation();
  const navigate = useNavigate();
  // const { questions }: { difficulty: string; questions: Type[] } =
  //   location.state;
 const data = location.state;
const questions = data?.questions ?? null;


  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const [quiz, setQuiz] = useState({
    selectedAnswer: null as string | null,
    quizFinished: false,
    isDisabled: false,
    submitted: false,
    timeLeft: 10,
    timerActive: true,
    totalTime: 0,
    currentIndex: 0,
    score: 0,
    final: [] as any[],
  });
 let currentQuestion:any=[]
 let options:any=[]
  const setoption = () =>{
    currentQuestion = questions[quiz.currentIndex];
  options = [
    ...currentQuestion?.incorrect_answers,
    currentQuestion?.correct_answer,
  ].sort();
  }
  if(questions != null ){
    setoption()
  }
  

  const handleSelect = (option: string) => {
    if (!quiz.submitted) {
      setQuiz((prev) => ({ ...prev, selectedAnswer: option }));
    }
  };

  const handleSubmit = () => {
    const updatedata = {
      ...currentQuestion,
      selectedAnswer: quiz.selectedAnswer,
      options,
    };
    setQuiz((prev) => ({
      ...prev,
      final: [...prev.final, updatedata],
    }));

    if (quiz.isDisabled) {
      setQuiz((prev) => ({
        ...prev,
        submitted: true,
        timerActive: false,
      }));
      return;
    }

    if (!quiz.selectedAnswer) {
      alert("Please select an answer!");
      return;
    }

    if (quiz.selectedAnswer === currentQuestion.correct_answer) {
      setQuiz((prev) => ({
        ...prev,
        score: prev.score + 1,
      }));
    }

    setQuiz((prev) => ({
      ...prev,
      submitted: true,
      isDisabled: true,
      timerActive: false,
    }));
  };

  const goToNextQuestion = () => {
    if (quiz.currentIndex < questions.length - 1) {
      setQuiz((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedAnswer: null,
        timeLeft: 10,
        isDisabled: false,
        submitted: false,
        timerActive: true,
      }));
    } else {
      setQuiz((prev) => ({ ...prev, quizFinished: true }));
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    console.log(quiz.final, "final array");
  }, [quiz.final]);

  useEffect(() => {
    if (quiz.quizFinished || !quiz.timerActive) return;

    if (quiz.timeLeft === 0) {
      setQuiz((prev) => ({
        ...prev,
        isDisabled: true,
        timerActive: false,
      }));
    }

    const timer = setInterval(() => {
      setQuiz((prev) => ({
        ...prev,
        timeLeft: prev.timeLeft > 0 ? prev.timeLeft - 1 : 0,
        totalTime: prev.totalTime + 1,
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz.timeLeft, quiz.quizFinished, quiz.timerActive]);

  if (quiz.quizFinished) {
    return (
      <div className="min-h-screen bg-black p-6 text-white">
        <center>
          <h1 className="text-2xl font-bold mb-4">Quiz Finished!</h1>
        </center>
        <div className="flex items-center justify-around mt-8">
          <button
                onClick={handleBack}
                className="px-3 py-2 mb-3 bg-gray-600 hover:bg-gray-700 text-white rounded border-2 flex items-center justify-center"
                title="Home"
              >
                <HomeIcon className="w-6 h-6 pr-1" /> Back to Quiz </button>
         <p className="mb-4 p-2 bg-blue-600">Score: {quiz.score}</p>
          <p className="mb-4 p-2 bg-yellow-500">
            Consuming Time: {quiz.totalTime}s
          </p>
        </div>
  
        <div className="grid grid-cols-4 m-8 text-sm ">
          {quiz.final.map((finals, index) => (
            <div key={index} className="m-2 p-4  px-5 bg-gray-50 rounded text-black">
              <div>
                <h2 className="text-lg font-bold mb-2">
                  Question {index + 1} / {quiz.final.length}
                </h2>
                <p className="mb-4">{decodeHtml(finals.question)}</p>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                {finals.options.map((opt: any, idx: number) => {
                  let btnClass = "border p-2 rounded italic hover:bg-gray-200";

                  if (quiz.submitted) {
                    if (opt === finals.correct_answer) {
                      btnClass = "border p-2 rounded italic bg-green-400";
                    } else if (
                      opt === finals.selectedAnswer &&
                      opt !== finals.correct_answer
                    ) {
                      btnClass = "border p-2 rounded italic bg-red-400";
                    } else {
                      btnClass = "border p-2 rounded italic opacity-70";
                    }
                  } else if (finals.selectedAnswer === opt) {
                    btnClass = "border p-2 rounded italic bg-blue-200";
                  }

                  return (
                    <div key={idx} className={btnClass}>
                      {decodeHtml(opt)}
                    </div>
                  );
                })}
              </div>
              <div>Correct Answer: {finals.correct_answer}</div>
            </div>
          ))}
        </div>
    
      </div>
    );
  }
    if(questions == null){
     return <div className="min-h-screen bg-black p-6 italic text-red-600 flex 
     flex-col space-y-5 items-center justify-center">
      <center><h1 className="font-bold text-4xl ">No Data Fount ?</h1></center>
      <button 
       className="px-2 py-1 mb-3 bg-blue-600 hover:bg-blue-700 text-white rounded border-2 flex items-center justify-center text-sm"
      onClick={() => navigate("/")}>GO Back</button>
     </div>
    }
  return (
    <div className="min-h-screen bg-black p-6 italic">

      <div className="flex flex-col items-center justify-center mt-6">
        <div className=" p-6 mt-5 bg-gray-800  text-white rounded shadow max-w-lg w-full border-2 border-cyan-500 neon-glow">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-2">
              Question {quiz.currentIndex + 1} / {questions.length}
            </h2>

            <div>
              <button
                onClick={handleBack}
                className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded border-2 border-cyan-500 flex items-center justify-center"
                title="Home"
              >
                <HomeIcon className="w-6 h-6 pr-1" /> Back to Quiz </button>
            </div>
          </div>
          <p className="text-red-600 font-bold mb-4">
            Time Left: {quiz.timeLeft}
          </p>

          <p className="mb-4">{decodeHtml(currentQuestion.question)}</p>

          <div className="flex flex-col gap-2 mb-4">
            {options.length !=0 && options?.map((opt:any, idx:any) => {
              let btnClass = "border-2 border-cyan-500  p-2 rounded italic hover:bg-gray-400 ";

              if (quiz.submitted) {
                if (opt === currentQuestion.correct_answer) {
                  btnClass = "border p-2 rounded italic bg-green-400";
                } else if (
                  opt === quiz.selectedAnswer &&
                  opt !== currentQuestion.correct_answer
                ) {
                  btnClass = "border p-2 rounded italic bg-red-400";
                } else {
                  btnClass = "border p-2 rounded italic opacity-70";
                }
              } else if (quiz.selectedAnswer === opt) {
                btnClass = "border p-2 rounded italic bg-blue-500";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(opt)}
                  disabled={quiz.isDisabled}
                  className={`${btnClass} ${
                    quiz.isDisabled ? "cursor-not-allowed" : ""
                  }`}
                >
                  {decodeHtml(opt)}
                </button>
              );
            })}
          </div>

          {!quiz.submitted ? (
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={goToNextQuestion}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              {quiz.currentIndex === questions.length - 1 ? "Finish" : "Next"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Question;
