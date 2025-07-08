import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import { ToastContainer } from "react-toastify";
import DashboardLayout from "./pages/DashboardLayout";
import OverviewPage from "./pages/OverviewPage";
import CompaniesPage from "./pages/CompaniesPage";
import ChatbotPage from "./pages/ChatbotPage";

function App() {
  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/" element={<LoginPage />} />

         <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="chatbots" element={<ChatbotPage/>} />
          {/* <Route path="search" element={<SearchPage />} /> */}
        </Route>


        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
