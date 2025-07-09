import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const AddAdminPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminList, setAdminList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await api.get("/admin/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setAdminList(response.data.admins);
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const response = await api.post(
        "/admin/create",
        { name, email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Admin created successfully.");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        fetchAdmins(); // refresh admin list
      } else {
        toast.error(response.response.data.error || "Failed to create admin.");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
        <h2 className="text-2xl font-bold text-center mb-6">
          ➕ Add New Admin
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Admin Name"
            className="w-full bg-gray-800 text-white placeholder-gray-400 p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full bg-gray-800 text-white placeholder-gray-400 p-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#121417] border border-gray-600 rounded-lg pr-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute cursor-pointer inset-y-0 right-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full cursor-pointer bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
              loading
                ? "opacity-60 cursor-not-allowed"
                : "hover:from-blue-500 hover:to-teal-400"
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
                Adding Admin...
              </div>
            ) : (
              "Add Admin"
            )}
          </button>
        </form>
      </div>

      {/* Admin List Table */}
      <div className="w-full max-w-4xl mt-10">
        <h3 className="text-xl font-semibold mb-4 text-white">👥 All Admins</h3>
        <div className="overflow-x-auto bg-gray-900 border border-gray-800 rounded-lg">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-gray-800 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Created At</th>
              </tr>
            </thead>
            <tbody>
              {adminList.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-t border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="p-3">{admin.name}</td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3">
                    {new Date(admin.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
              {adminList.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-gray-400" colSpan={3}>
                    No admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddAdminPage;
