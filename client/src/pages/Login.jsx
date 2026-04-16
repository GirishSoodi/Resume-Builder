import { Mail, User2Icon, Lock, FileText } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import api from "../configs/api";

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");
  const [state, setState] = useState(urlState || "login");

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => { e.preventDefault()
    try {
      const { data } = await api.post(`/api/users/${state}`, formData)
      dispatch(login(data))
      localStorage.setItem('token', data.token)
      toast.success(data.message)
      navigate('/app')
    } catch(error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isLogin = state === "login";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">

      {/* Navbar */}
      <div className="px-8 py-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <img src="/logo.svg" alt="logo" className="h-8 w-auto" />
        </Link>
      </div>

      {/* Main */}
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 px-8 py-10">

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="size-14 bg-green-100 rounded-2xl flex items-center justify-center">
                <FileText className="size-7 text-green-600" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-900 text-center">
              {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-sm text-gray-500 text-center mt-1 mb-8">
              {isLogin ? "Sign in to continue building your resume" : "Get started with your free account"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAME */}
              {!isLogin && (
                <div className="flex items-center border border-gray-200 rounded-xl px-4 h-12 gap-3 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                  <User2Icon size={16} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none border-0 ring-0 text-sm"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              {/* EMAIL */}
              <div className="flex items-center border border-gray-200 rounded-xl px-4 h-12 gap-3 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                <Mail size={16} className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none border-0 ring-0 text-sm"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="flex items-center border border-gray-200 rounded-xl px-4 h-12 gap-3 focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
                <Lock size={16} className="text-gray-400 shrink-0" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none border-0 ring-0 text-sm"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* FORGOT PASSWORD */}
              {isLogin && (
                <div className="text-right">
                  <button type="button" className="text-xs text-green-600 hover:underline">
                    Forgot password?
                  </button>
                </div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full h-12 rounded-xl text-white font-medium bg-green-500 hover:bg-green-600 active:scale-95 transition-all mt-2"
              >
                {isLogin ? "Sign in" : "Create account"}
              </button>
            </form>

            {/* TOGGLE */}
            <p className="text-sm text-gray-500 text-center mt-6">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setState(isLogin ? "register" : "login")}
                className="text-green-600 font-medium hover:underline ml-1"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Footer note */}
          <p className="text-xs text-gray-400 text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
