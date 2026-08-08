import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:3001/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/users/login`,
        {
          email,
          password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const user = response.data.user;

      // Save logged-in user
      localStorage.setItem(
        "libraryUser",
        JSON.stringify(user)
      );

      toast.success("Login successful!");

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error.response) {
        toast.error(
          error.response.data?.message ||
          "Invalid email or password"
        );
      } else if (error.request) {
        toast.error(
          "Unable to connect to server. Make sure backend is running."
        );
      } else {
        toast.error("Login failed");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-2xl p-8">

          <div className="text-center mb-8">

            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-3xl">📚</span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Welcome Back
            </h1>

            <p className="text-slate-500 mt-2">
              Login to your Library Management System
            </p>

          </div>

          <form onSubmit={loginUser} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-300 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

          </form>

          <div className="text-center mt-6">

            <p className="text-slate-500">
              Don't have an account?
            </p>

            <button
              onClick={() => navigate("/register")}
              className="text-blue-600 font-semibold hover:underline mt-1"
            >
              Create Account
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;