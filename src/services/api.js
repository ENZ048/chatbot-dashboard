import axios from "axios";

const api = axios.create({
    baseURL: "https://chatbot-rag-production-319e.up.railway.app/api",
    withCredentials: true,
});

export default api;