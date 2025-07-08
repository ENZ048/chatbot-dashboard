import { useEffect, useState } from "react";
import api from "../services/api";
import { saveAs } from "file-saver"; // install this if needed

const MessageHistory = ({ chatbotId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get(`/chatbot/messages/${chatbotId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = "User,Message,Response,Timestamp\n";

    const rows = [];
    let i = 0;

    while (i < messages.length) {
      const userMsg = messages[i];
      const botMsg = messages[i + 1];

      // Confirm this is a user → bot pair
      if (userMsg?.sender === "user" && botMsg?.sender === "bot") {
        rows.push(
          [
            userMsg.sender,
            `"${userMsg.content}"`, // wrap in quotes to prevent CSV breaking
            `"${botMsg.content}"`,
            new Date(userMsg.timestamp).toLocaleString(),
          ].join(",")
        );
        i += 2; // move to next pair
      } else {
        i += 1; // skip bad/missing data
      }
    }

    const csv = headers + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, "chatbot_messages.csv");
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) return <p className="text-gray-400">Loading messages...</p>;
  if (!messages.length)
    return <p className="text-gray-500 italic">No messages found.</p>;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">
          Showing {messages.length} message{messages.length !== 1 && "s"}
        </p>
        <button
          onClick={exportCSV}
          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm"
        >
          Export CSV
        </button>
      </div>

      <div className="divide-y divide-gray-700 max-h-[60vh] overflow-y-auto rounded-lg border border-gray-700">
        {messages.map((msg) => (
          <div key={msg.id} className="border-b p-4 border-gray-700 py-2">
            <p className="text-sm text-gray-400">{msg.sender}:</p>
            <p className="text-white">{msg.content}</p>{" "}
            {/* ← this was likely missing */}
            <p className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageHistory;
