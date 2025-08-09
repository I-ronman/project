import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 스프링 백엔드 프록시
      '/web': {
        target: 'http://localhost:329',
        changeOrigin: true,
      },
      // socket.io 서버 쓰는 경우
      '/socket.io': {
        target: 'http://localhost:525', // 소켓 서버 포트
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
