import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const { questions }: { difficulty: string; questions: Type[] } =
    location.state;

  function decodeHtml(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const [quiz,setQuiz] = useState({
    currentIndex : 0,
    score : 0,
    correctCount : 0,
    wrongCount : 0
  })
  // const [currentIndex, setCurrentIndex] = useState(0);
  //  const [score, setScore] = useState(0);
  //  const [correctCount, setCorrectCount] = useState(0);
  //  const [wrongCount, setWrongCount] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); 

  const currentQuestion = questions[quiz.currentIndex];
  const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort();

  const handleSelect = (option: string) => {
    setSelectedAnswer(option);
  };

  const goToNextQuestion = () => {
    if (selectedAnswer === currentQuestion.correct_answer) {
     setQuiz(prev => ({
  ...prev,
  score: prev.score + 1,
  correctCount: prev.correctCount + 1
}));
    } else {
      setQuiz(prev => ({
        ...prev,
        wrongCount : prev.wrongCount +1
      }));
    }

    if (quiz.currentIndex < questions.length - 1) {
     setQuiz(prev => ({
  ...prev,
  currentIndex: prev.currentIndex + 1
}));
      setSelectedAnswer(null);
      setTimeLeft(10); 
    } else {
      setQuizFinished(true);
    }
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      alert("Please select an answer!");
      return;
    }
    goToNextQuestion();
  };

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    if (quizFinished) return;

    if (timeLeft === 0) {
      goToNextQuestion();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizFinished]); 

  if (quizFinished) {
    return (
      <div
      
      className="min-h-screen bg-black p-6 flex items-center justify-center text-white">
        <div className="bg-gray-800 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Finished!</h2>
          <p className="mb-2 p-2 bg-green-600">Correct: {quiz.correctCount}</p>
          <p className="mb-2 p-2 bg-red-600">Wrong: {quiz.wrongCount}</p>
          <p className="mb-4 p-2 bg-blue-600">Score: {quiz.score}</p>

           <button
          onClick={handleBack}
          className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-3 rounded-xl"
        >
          Back To Quiz
        </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6 italic">
      <div>
        <button
          onClick={handleBack}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
        >
          Back To Quiz
        </button>
      </div>

      <div className="flex flex-col items-center justify-center mt-6">
        <div className="bg-white p-6 rounded shadow max-w-lg w-full">
          <h2 className="text-lg font-bold mb-2">
            Question {quiz.currentIndex + 1} / {questions.length}
          </h2>

          {/* Timer display */}
          <p className="text-red-600 font-bold mb-4">Time Left: {timeLeft}s</p>

          <p className="mb-4">{decodeHtml(currentQuestion.question)}</p>

          <div className="flex flex-col gap-2 mb-4">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt)}
                className={`border p-2 rounded italic ${
                  selectedAnswer === opt ? "bg-blue-200" : "hover:bg-gray-200"
                }`}
              >
                {decodeHtml(opt)}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {quiz.currentIndex === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Question;
