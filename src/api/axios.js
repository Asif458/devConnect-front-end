import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change port if needed
  withCredentials: true, // critical for cookies
});

export default api;