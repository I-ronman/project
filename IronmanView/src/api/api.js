// src/api/api.js
import axios from "axios";

const API_BASE =
  import.meta.env?.VITE_API_BASE_URL ||      // 운영: https://api.your-domain.com/web
  (window._env_ && window._env_.API_BASE_URL) ||
  "/web";                                     // 개발 기본값(프록시)
  
export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});
