import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/admin/login", {
        email,
        password,
      });

      const { token } = res.data;
      localStorage.setItem("adminToken", token);
      localStorage.setItem("isAdmin", "true");

      toast.success("Login successful 🎉");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1013] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1a1c1f] text-white rounded-2xl shadow-lg p-8 relative border border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            Troika Tech
          </h1>
          <p className="text-gray-400 mt-1">Chatbot Management Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#121417] border border-gray-600 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
              placeholder="admin@troka.ai"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-[#121417] border border-gray-600 rounded-lg pr-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full cursor-pointer bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
              loading ? "opacity-60 cursor-not-allowed" : "hover:from-blue-500 hover:to-teal-400"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Logging in...
              </div>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Troika Technologies. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
