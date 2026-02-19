import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Login from './features/auth/Login';
import WorkoutsList from './features/workouts/WorkoutsList';
import WorkoutForm from './features/workouts/WorkoutForm';

function App() {
  const [message, setMessage] = useState("loading....");

  useEffect(() => {
    fetch("http://localhost:8080/api/v1")
    .then( res => res.text())
    .then(setMessage)
    .catch(() => setMessage("Error calling backend"));
  }, []);

  return (
    <>
<div>
      <h1>Thryve App</h1>
      <p>Backend says: {message}</p>
    </div>

    <nav className="pg-4 bg-blue-200">
      <Link to="/login" className="mr-4">Login</Link>
      <Link to="/workouts" className="mr-4">Workouts</Link>
      <Link to="/new-workout" className="mr-4">New Workout</Link>
    </nav>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/workouts" element={<WorkoutsList />} />
      <Route path="/new-workout" element={<WorkoutForm />} />
      <Route path="/" element={<Navigate to="/workouts" />} />
    </Routes>
    </>
    
  )
}

export default App
