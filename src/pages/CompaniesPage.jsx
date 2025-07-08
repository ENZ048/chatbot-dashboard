import { useState, useEffect } from "react";
import api from "../services/api";
import CompanyTable from "../components/CompanyTable";
import AddCompanyModal from "../components/AddCompanyModal";
import ClipLoader from "react-spinners/ClipLoader";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get("/company/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ If the response is like { companies: [...] }
      setCompanies(res.data.companies);
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <ClipLoader size={40} color="#4A90E2" loading={loading} />
      </div>
    );
  }

  if (!companies) {
    return <p className="text-red-400">Failed to load Companies.</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <input
          className="px-4 py-2 bg-[#1a1c1f] border border-gray-600 rounded-lg text-white w-full max-w-sm"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="ml-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium"
        >
          + Add Company
        </button>
      </div>

      <CompanyTable companies={filtered} refresh={fetchCompanies} />

      {showAddModal && (
        <AddCompanyModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchCompanies}
        />
      )}
    </div>
  );
};

export default CompaniesPage;
