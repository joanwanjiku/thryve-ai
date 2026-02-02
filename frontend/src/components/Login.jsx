// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { authAPI } from '../services/api';

// const Login = () => {
//   const [credentials, setCredentials] = useState({
//     username: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       // Placeholder login - in production, this would call the backend
//       // const response = await authAPI.login(credentials);
      
//       // For now, just simulate a successful login
//       if (credentials.username && credentials.password) {
//         localStorage.setItem('isAuthenticated', 'true');
//         localStorage.setItem('username', credentials.username);
//         navigate('/workouts');
//       } else {
//         setError('Please enter username and password');
//       }
//     } catch (err) {
//       setError('Login failed. Please check your credentials.');
//       console.error('Login error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <div className="card shadow">
//             <div className="card-body">
//               <h2 className="card-title text-center mb-4">Login</h2>
              
//               {error && (
//                 <div className="alert alert-danger" role="alert">
//                   {error}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                   <label htmlFor="username" className="form-label">Username</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     id="username"
//                     name="username"
//                     value={credentials.username}
//                     onChange={handleChange}
//                     placeholder="Enter username"
//                     required
//                   />
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="password" className="form-label">Password</label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     id="password"
//                     name="password"
//                     value={credentials.password}
//                     onChange={handleChange}
//                     placeholder="Enter password"
//                     required
//                   />
//                 </div>

//                 <div className="d-grid">
//                   <button 
//                     type="submit" 
//                     className="btn btn-primary"
//                     disabled={loading}
//                   >
//                     {loading ? 'Logging in...' : 'Login'}
//                   </button>
//                 </div>
//               </form>

//               <div className="text-center mt-3">
//                 <small className="text-muted">
//                   Demo: Use any username/password to login
//                 </small>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
