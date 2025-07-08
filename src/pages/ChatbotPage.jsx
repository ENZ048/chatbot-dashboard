import { useEffect, useState } from "react";
import api from "../services/api";
import MessageHistory from "../components/MessageHistory";
import ClipLoader from "react-spinners/ClipLoader";

const ManageChatbotsPage = () => {
  const [chatbots, setChatbots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newLimit, setNewLimit] = useState("");
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchChatbots();
  }, []);

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
              </div>
              <div>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  className="text-sm text-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              <div>
                <p className="text-sm text-gray-400">
                  📊 Token Usage (Monthly)
                </p>
                <p className="text-base font-semibold text-white">
                  {cb.used_tokens || 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">💬 Total Messages</p>
                <p className="text-base font-semibold text-white">
                  {cb.total_messages || 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">👥 Unique Users</p>
                <p className="text-base font-semibold text-white">
                  {cb.unique_users || 0}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">🔋 Remaining Tokens</p>
                <p className="text-base font-semibold text-white">
                  {cb.token_limit != null && cb.used_tokens != null
                    ? Math.max(cb.token_limit - cb.used_tokens, 0)
                    : "Unlimited"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">📦 Total Token Limit</p>
                {editingId === cb.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newLimit}
                      onChange={(e) => setNewLimit(e.target.value)}
                      className="w-24 px-2 py-1 rounded"
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
                    <span className="text-base font-semibold text-white">
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

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setSelected(cb);
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
              >
                View Message History
              </button>
            </div>
          </div>
        ))}
      </div>

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
