import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Quiz_app from "./Page/Quiz_app";
import Question from "./Page/Question"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function App() {
  const queryClient = new QueryClient();
  return (
      <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Quiz_app />}/>
        <Route path="/question" element={<Question/>}/> 
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
