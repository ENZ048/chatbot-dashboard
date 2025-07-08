import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Bot,
  Building2,
  Users,
  MessageSquareText,
  BarChart3,
} from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader"; // 🔄 Spinner import

const OverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get("/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <ClipLoader size={40} color="#4A90E2" loading={loading} />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-red-400">Failed to load stats.</p>;
  }

  const statData = [
    {
      label: "Total Chatbots",
      value: stats.totalChatbots,
      icon: <Bot className="w-6 h-6 text-blue-400" />,
    },
    {
      label: "Total Companies",
      value: stats.totalCompanies,
      icon: <Building2 className="w-6 h-6 text-teal-400" />,
    },
    {
      label: "Unique Users",
      value: stats.unique_users,
      icon: <Users className="w-6 h-6 text-yellow-400" />,
    },
    {
      label: "Total Messages",
      value: stats.totalMessages,
      icon: <MessageSquareText className="w-6 h-6 text-purple-400" />,
    },
    {
      label: "Monthly Tokens",
      value: stats.monthlyTokenUsage.toLocaleString(),
      icon: <BarChart3 className="w-6 h-6 text-pink-400" />,
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-white">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statData.map((stat, idx) => (
          <div
            key={idx}
            className="bg-[#1f2125] p-6 rounded-xl border border-gray-700 shadow hover:shadow-lg transition-all duration-200 hover:scale-[1.02] flex items-center gap-4"
          >
            <div className="bg-gray-900 p-3 rounded-lg">{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <h3 className="text-2xl font-semibold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewPage;
