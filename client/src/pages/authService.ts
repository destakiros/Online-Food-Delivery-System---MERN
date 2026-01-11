import axios from 'axios';

const API_URL = '/api/users';

export const login = async (email: string, pass: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password: pass });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

const authService = { login, logout };
export default authService;