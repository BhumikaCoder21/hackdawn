import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("✅ Signup Successful!");
      navigate("/");
    } catch (error) {
      console.error("Signup Error:", error.code, error.message);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50">
      <form className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md" onSubmit={handleSignup}>
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Create Account</h2>

        <input
          className="w-full border p-2 rounded mb-4"
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full border p-2 rounded mb-4"
          type="password"
          placeholder="Password (Min 6)"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
          Sign Up
        </button>

        <p
          className="text-sm text-center mt-3 text-green-700 cursor-pointer underline"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}
