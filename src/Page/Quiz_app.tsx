import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

type QuestionType = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

const Api = (difficulty: string) => {
  return `https://opentdb.com/api.php?amount=10&category=9&difficulty=${difficulty}&type=multiple`
};

function Quiz_app() {
  const [difficulty, setDifficulty] = useState("");
  const [isBlack, setIsBlack] = useState(true);
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useQuery<QuestionType[]>({
    queryKey: ["quizData", difficulty],
    queryFn: async () => {
      const url = Api(difficulty);
      if (!url) throw new Error("Invalid difficulty");
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch questions");
      const json = await res.json();
      return json.results;
    },
    enabled: false
  });

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!difficulty) {
      alert(" Please select a difficulty!");
      return;
    }

    const result = await refetch();
    if (result.data) {
      navigate("/question", { state: { difficulty, questions: result.data } });
    }
  };

  return (
              
         <div className={`h-screen transition-colors duration-500 
            ${isBlack ? "bg-black" : "bg-gray-300"}`}>
            <div>
      <button
        onClick={() => setIsBlack(!isBlack)}
        className=" px-6 py-3 text-white rounded-lg bg-gray-600 hover:bg-gray-800 transition mt-10 ml-[70%] "
      >
        Toggle Background
      </button>
      </div>
         <center>    

     <div className="mt-24">
      <form
        onSubmit={handleStart}
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h1 className="text-2xl font-bold mb-2">Quiz App</h1>
        <p className="mb-4 text-sm">General Knowledge — pick difficulty</p>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">Pick Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {isLoading ? "Loading..." : "Start"}
        </button>

        {error instanceof Error && (
          <p className="text-red-600 mt-3">{error.message}</p>
        )}
      </form>
      </div>
      
      </center> 
    </div>
  
  );
}

export default Quiz_app;
