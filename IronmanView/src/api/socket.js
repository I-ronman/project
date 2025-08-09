import { io } from "socket.io-client";

const SOCKET_URL =
  (import.meta?.env && import.meta.env.VITE_SOCKET_URL) ||
  (window._env_ && window._env_.SOCKET_URL) ||
  window.location.origin; // 기본: 같은 오리진

export const makeSocket = () =>
  io(SOCKET_URL, { path: "/socket.io", transports: ["websocket"] });
