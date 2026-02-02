import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import Login from "./features/auth/Login";
import WorkoutsList from "./features/workouts/WorkoutsList";
import WorkoutForm from "./features/workouts/WorkoutForm";
import Navbar from "./components/Navbar";

function App() {

  return (
    <>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/workouts" element={<WorkoutsList />} />
          <Route path="/new-workout" element={<WorkoutForm />} />
          <Route path="/" element={<Navigate to="/workouts" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;



