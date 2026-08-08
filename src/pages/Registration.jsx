import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:3001/api";

function Registration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must contain at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/users/register`,
        {
          name,
          email,
          password,
          role: "User",
        }
      );

      console.log("REGISTRATION RESPONSE:", response.data);

      toast.success("Registration successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.error("REGISTRATION ERROR:", error);

      if (error.response) {
        toast.error(
          error.response.data?.message ||
          "Registration failed"
        );
      } else if (error.request) {
        toast.error(
          "Unable to connect to server. Make sure backend is running."
        );
      } else {
        toast.error("Registration failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-2xl p-8">

          {/* Header */}

          <div className="text-center mb-8">

            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">

              <span className="text-3xl">
                📚
              </span>

            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Create Account
            </h1>

            <p className="text-slate-500 mt-2">
              Join the Library Management System
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* Name */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Email */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Password */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Confirm Password */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Button */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-300 disabled:opacity-60"
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>

          {/* Login */}

          <div className="text-center mt-6">

            <p className="text-slate-500">
              Already have an account?
            </p>

            <button
              onClick={() => navigate("/")}
              className="text-blue-600 font-semibold hover:underline mt-1"
            >
              Login
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Registration;