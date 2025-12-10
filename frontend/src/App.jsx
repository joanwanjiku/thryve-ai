import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState("loading....");

  useEffect(() => {
    fetch("http://localhost:8080/api/v1")
    .then( res => res.text())
    .then(setMessage)
    .catch(() => setMessage("Error calling backend"));
  }, []);

  return (
    <div>
      <h1>Thryve App</h1>
      <p>Backend says: {message}</p>
    </div>
  )
}

export default App
