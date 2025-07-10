import { useEffect, useState } from "react";
import api from "../services/api";
import MessageHistory from "../components/MessageHistory";
import ClipLoader from "react-spinners/ClipLoader";
import UploadContextModal from "../components/UploadContextModal";

const ManageChatbotsPage = () => {
  const [chatbots, setChatbots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newLimit, setNewLimit] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [renewing, setRenewing] = useState(null);
  const [subscriptions, setSubscriptions] = useState({});
  const [selectedPlan, setSelectedPlan] = useState("1");
  const [availablePlans, setAvailablePlans] = useState([]);

  const fetchChatbots = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get("/chatbot/all", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setChatbots(res.data.chatbots || []);
    } catch (err) {
      console.error("Failed to fetch chatbots:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get("/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailablePlans(res.data.plans || []);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    }
  };

  useEffect(() => {
    fetchChatbots();
    fetchPlans();
  }, []);

  const handleRenew = async (id) => {
    const token = localStorage.getItem("adminToken");

    // Find the selected plan from availablePlans array
    const planDetails = availablePlans.find((p) => p.id === selectedPlan);
    const durationDays = planDetails?.duration_days || 30; // fallback

    const months = Math.ceil(durationDays / 30); // convert days to months (approx)

    if (!selectedPlan) {
      alert("Please select a plan.");
      return;
    }

    try {
      await api.post(
        `/chatbot/${id}/renew`,
        {
          plan_id: selectedPlan,
          months,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Plan renewed successfully");
      fetchSubscription(id);
      setRenewing(null);
    } catch (err) {
      console.error("Renewal error:", err);
      alert("❌ Renewal failed");
    }
  };

  const fetchSubscription = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get(`/chatbot/${id}/subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptions((prev) => ({ ...prev, [id]: res.data.subscription }));
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
    }
  };

  useEffect(() => {
    if (chatbots.length > 0) {
      chatbots.forEach((cb) => fetchSubscription(cb.id));
    }
  }, [chatbots]);

  const filtered = chatbots.filter((cb) =>
    cb.name.toLowerCase().includes(search.toLowerCase())
  );

  const updateTokenLimit = async (id, limit) => {
    try {
      const token = localStorage.getItem("adminToken");
      await api.put(
        `/chatbot/update-token-limit/${id}`,
        { token_limit: parseInt(limit, 10) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchChatbots(); // Refresh list
      setEditingId(null);
      setNewLimit("");
    } catch (err) {
      console.error("Failed to update token limit:", err);
    }
  };

  const handleDownloadReport = async (chatbotId) => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem("adminToken");
      const response = await api.get(`/report/download/${chatbotId}`, {
        responseType: "blob", // important for PDF or file download
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${chatbotId}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download report:", err);
      alert("❌ Failed to download report. Try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <ClipLoader size={40} color="#4A90E2" loading={loading} />
      </div>
    );
  }

  if (!chatbots) {
    return <p className="text-red-400">Failed to load Companies.</p>;
  }

  return (
    <div className="min-h-screen bg-[#0e0f11] text-gray-200 p-6">
      <h2 className="text-3xl font-bold mb-6 text-white">🚀 Manage Chatbots</h2>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search chatbots..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 px-4 py-2 rounded-lg bg-[#1c1e22] border border-gray-600 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div className="space-y-5">
        {filtered.map((cb) => (
          <div
            key={cb.id}
            className="bg-[#1a1c1f] border border-gray-700 rounded-2xl p-6 shadow hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white">{cb.name}</h3>
                <p className="text-sm text-gray-400">
                  Company: {cb.company_name}
                </p>
                <p className="text-sm text-gray-400">
                  Domain: {cb.company_url}
                </p>
                <p className="text-sm text-gray-400">ID: {cb.id}</p>
              </div>
              <div>
                <UploadContextModal chatbotId={cb.id} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-400">
                  📊 Token Usage (Monthly)
                </p>
                <p className="text-2xl mt-2 font-semibold text-white">
                  {cb.used_tokens || 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">💬 Total Messages</p>
                <p className="text-2xl mt-2 font-semibold text-white">
                  {cb.total_messages || 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">👥 Unique Users</p>
                <p className="text-2xl mt-2 font-semibold text-white">
                  {cb.unique_users || 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">🔋 Remaining Tokens</p>
                <p className="text-2xl mt-2 font-semibold text-white">
                  {cb.token_limit != null && cb.used_tokens != null
                    ? Math.max(cb.token_limit - cb.used_tokens, 0)
                    : "Unlimited"}
                </p>
              </div>

              {subscriptions[cb.id] && subscriptions[cb.id].plans ? (
                <div className="bg-[#25272c] p-4 rounded-xl col-span-full">
                  <p className="text-sm text-gray-400 font-semibold mb-1">
                    📦 Plan Details:
                  </p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>🔖 Name: {subscriptions[cb.id].plans.name}</li>
                    <li>
                      📅 Duration: {subscriptions[cb.id].plans.duration_days}{" "}
                      days
                    </li>
                    <li>
                      👥 Max Users: {subscriptions[cb.id].plans.max_users}
                    </li>
                    <li>💰 Price: ₹{subscriptions[cb.id].plans.price}</li>
                    <li>
                      ⏳ Expires:{" "}
                      {new Date(
                        subscriptions[cb.id].end_date
                      ).toLocaleDateString()}
                    </li>
                    <li>
                      👥 Users Used: {cb.unique_users} /{" "}
                      {subscriptions[cb.id].plans.max_users}
                    </li>
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-yellow-400 col-span-full">
                  No active plan
                </p>
              )}

              <div>
                <p className="text-sm text-gray-400">📦 Total Token Limit</p>
                {editingId === cb.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                      className="w-24 text-2xl mt-2 px-2 py-1 rounded"
                    />
                    <button
                      onClick={() => updateTokenLimit(cb.id, newLimit)}
                      className="text-green-400 hover:text-green-600"
                    >
                      ✅
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setNewLimit("");
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      ❌
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl mt-2 font-semibold text-white">
                      {cb.token_limit || "Unlimited"}
                    </span>
                    <button
                      onClick={() => {
                        setEditingId(cb.id);
                        setNewLimit(cb.token_limit || "");
                      }}
                      className="text-blue-400 hover:text-blue-600"
                      title="Edit token limit"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-4 justify-end">
              <button
                onClick={() => {
                  setSelected(cb);
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
              >
                View Message History
              </button>

              <button
                onClick={() => handleDownloadReport(cb.id)}
                disabled={isDownloading}
                className={`w-1/4 cursor-pointer bg-gradient-to-r from-blue-600 to-teal-500 text-white py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
                  isDownloading
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:from-blue-500 hover:to-teal-400"
                }`}
              >
                {isDownloading ? (
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
                    Downloading report...
                  </div>
                ) : (
                  "Download Report"
                )}
              </button>

              <button
                onClick={() => setRenewing(cb.id)}
                className="text-sm px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Renew Plan
              </button>
            </div>
          </div>
        ))}
      </div>

      {renewing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] p-6 rounded-lg w-[400px] relative">
            {/* ❌ Close button */}
            <button
              onClick={() => setRenewing(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none"
              title="Close"
            >
              &times;
            </button>

            <h3 className="text-lg font-semibold text-white mb-4">
              Renew Plan
            </h3>

            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full p-2 rounded mb-4 bg-[#2b2d31] text-white"
            >
              <option disabled value="">
                Select a plan
              </option>
              {availablePlans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} – ₹{plan.price} for {plan.duration_days} days (
                  {plan.max_users} users)
                </option>
              ))}
            </select>

            <button
              onClick={() => handleRenew(renewing)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Confirm Renew
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1f2227] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 relative text-white shadow-lg">
            <h3 className="text-2xl font-bold mb-4">
              🧾 Message History - {selected.name}
            </h3>

            <MessageHistory chatbotId={selected.id} />

            <div className="flex gap-4 justify-end mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelected(null);
                }}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageChatbotsPage;
