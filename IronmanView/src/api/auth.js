// 로그인/회원가입 API 요청을 모듈화해 백엔드와 연동
import axios from 'axios'

const BASE_URL = 'http://localhost:329/web'  // 백엔드 주소

export const login = async (id, pw) => {
  return axios.post(`${BASE_URL}/login`, { id, pw }, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const register = async (id, pw, name) => {
  return axios.post(`${BASE_URL}/register`, { id, pw, name }, {
    headers: { 'Content-Type': 'application/json' }
  });
};
