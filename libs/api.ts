import axios from "axios";

const api = axios.create({
  baseURL: "/api", 
  headers: {
    "Content-Type": "application/json",
  },
});


export function setAPIToken(token: string) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
