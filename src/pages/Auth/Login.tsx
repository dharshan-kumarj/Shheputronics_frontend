// src/pages/auth/Login.tsx
import React, { useState } from 'react';
import { handleUserLogin } from '../../api/Auth';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
 const navigate = useNavigate();
 const [loginData, setLoginData] = useState({
   username: '',
   password: ''
 });

 const [message, setMessage] = useState<string>('');
 const [error, setError] = useState<string>('');

 const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   setLoginData({
     ...loginData,
     [e.target.name]: e.target.value
   });
 };

 const handleLoginSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setMessage('');
   setError('');

   try {
     const result = await handleUserLogin(loginData);
     
     if (result.success && result.data?.token) {
       // Save token in cookies
       Cookies.set('token', `Bearer ${result.data.token}`, {
         expires: 7, // Token expires in 7 days
         secure: true, // Only sent over HTTPS
         sameSite: 'strict' // Protect against CSRF
       });

       setMessage('Login successful!');
       setLoginData({ username: '', password: '' });
       
       // Redirect to addresses page after successful login
       setTimeout(() => {
         navigate('/address');
       }, 1000);
     } else {
       setError(result.error || 'Login failed');
     }
   } catch (err) {
     setError('Something went wrong!');
   }
 };

 return (
   <div className="flex min-h-screen items-center justify-center">
     <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
       <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
       
       <form onSubmit={handleLoginSubmit} className="space-y-4">
         <div>
           <label className="block text-sm font-medium text-gray-700">Username</label>
           <input
             type="text"
             name="username"
             value={loginData.username}
             onChange={handleLoginChange}
             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
             required
           />
         </div>

         <div>
           <label className="block text-sm font-medium text-gray-700">Password</label>
           <input
             type="password"
             name="password"
             value={loginData.password}
             onChange={handleLoginChange}
             className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
             required
           />
         </div>

         <button
           type="submit"
           className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
         >
           Login
         </button>
       </form>

       {message && (
         <div className="fixed top-4 right-4 p-4 bg-green-100 text-green-700 rounded shadow-lg">
           {message}
         </div>
       )}

       {error && (
         <div className="fixed top-4 right-4 p-4 bg-red-100 text-red-700 rounded shadow-lg">
           {error}
         </div>
       )}
     </div>
   </div>
 );
};

export default Login;