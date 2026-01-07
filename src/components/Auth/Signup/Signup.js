'use client';
import { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('email', formData.email);
    data.append('password', formData.password);

    try {
      const response = await fetch('http://localhost:8121/api/admin/signup', {
        method: 'POST',
        body: data, 
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("✅ Signup Successful!");
      } else {
        alert(" Error: " + result.message);
      }
    } catch (error) {
      alert("Server error!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-10 bg-gray-100 rounded-lg">
      <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2 mb-2 block w-full" required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 mb-4 block w-full" required />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">Sign Up</button>
    </form>
  );
}