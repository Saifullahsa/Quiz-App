import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

type CategoryType = {
  id: number;
  name: string;
};

const Api = (difficulty: string, category: string) => {
  if (!difficulty && !category) {
    return `https://opentdb.com/api.php?amount=10&type=multiple`;
  } else if (difficulty && category) {
    return `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
  } else if (!difficulty && category) {
    return `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`;
  } else if (difficulty && !category) {
    return `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`;
  }
};

function Quiz_app() {
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");
  const [isBlack, setIsBlack] = useState(true);
  const navigate = useNavigate();

  const { isLoading, error, refetch } = useQuery<[]>({
    queryKey: ["quizData", difficulty, category],
    queryFn: async () => {
      const url = Api(difficulty, category);
      if (!url) throw new Error("Invalid API parameters");
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch questions");
      const json = await res.json();
      return json.results;
    },
    enabled: false,
    retry : 0,
    staleTime : 5000 
  });

  const { data: categories } = useQuery<CategoryType[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("https://opentdb.com/api_category.php");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const json = await res.json();
      return json.trivia_categories;
    },
  });

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await refetch();
    if (result.data) {
      navigate("/question", {
        state: { category, difficulty, questions: result.data },
      });
    }
  };

  return (
    <div
      className={`min-h-screen p-20 duration-500 ${
        isBlack ? "bg-black text-white" : "bg-gray-300 text-black"
      }`}
    >
      <div>
        <button
          onClick={() => setIsBlack(!isBlack)}
          className={`border-2 px-4 py-2 rounded-lg ml-[57%] flex items-center gap-2 ${
            isBlack
              ? "bg-gray-600 hover:bg-gray-800 text-white"
              : "bg-white hover:bg-gray-200 text-black "
          }`}
        >
          {isBlack ? (
            <>
              <SunIcon className="w-6 h-6 text-yellow-400" />
              Light Mode
            </>
          ) : (
            <>
              <MoonIcon className="w-6 h-6 text-gray-800" />
              Dark Mode
            </>
          )}
        </button>
      </div>

      <center>
        <div className="mt-5">
          <form
            onSubmit={handleStart}
            className={`w-full max-w-md mt-8 p-8 rounded border-9 border-cyan-500 shadow-lg neon-glow ${
              isBlack ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <h1 className="text-2xl font-bold mb-2">Quiz App</h1>
            <h2 className="mr-[59%] p-2">
              <b>SELECT CATEGORY</b>
            </h2>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full border p-2 rounded mb-4 ${
                isBlack
                  ? "bg-gray-700 border-2 border-cyan-500 focus:outline-cyan-300 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            >
              <option value="">Any Category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <h2 className="mr-[56%] p-2">
              <b>SELECT DIFFICULTY</b>
            </h2>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={`w-full border p-2 rounded mb-4 ${
                isBlack
                  ? "bg-gray-700 border-2 border-cyan-500 focus:outline-cyan-300 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
            >
              <option value="">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 border-2 border-cyan-500 text-white py-2 rounded "
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
