import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const AddCompanyModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      await api.post(
        "/company/create",
        {
          name,
          url,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Company Added");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(`${err.response.data.message}`);
      console.error("Failed to add company:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1a1c1f] p-6 rounded-lg border border-gray-700 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Add Company</h2>
        <input
          className="w-full mb-3 px-4 py-2 bg-[#121417] border border-gray-600 rounded text-white"
          placeholder="Company Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full mb-4 px-4 py-2 bg-[#121417] border border-gray-600 rounded text-white"
          placeholder="Domain"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleAdd}
            disabled={loading}
            className={`w-1/4 cursor-pointer bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
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
                Adding...
              </div>
            ) : (
              "Add"
            )}
          </button>

          <button onClick={onClose} className="text-gray-400 hover:underline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCompanyModal;
