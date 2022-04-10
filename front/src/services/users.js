import axios from 'axios';
import { BACKEND } from '../globals';

export const users = {
  /**
   * Register and login to the backend, or throws
   * @returns token The token of the successful login
   */
  async register(username, password) {
    console.log('try register', username, password);
    try {
      await axios.post(`${BACKEND}/api/register`, {
        username,
        password,
      });

      const response = await axios.post(`${BACKEND}/api/login`, {
        username,
        password,
      });
      const token = response.data.data;
      return token;
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },

  /**
   * Login to the backend, or throws
   * @returns token The token of the successful login
   */
  async login(username, password) {
    console.log('try register', username, password);
    try {
      const response = await axios.post(`${BACKEND}/api/login`, {
        username,
        password,
      });
      const token = response.data.data;
      return token;
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },

  /**
   * Get the user associated with the given token
   */
  async whoami(token) {
    const response = await axios.get(`${BACKEND}/api/whoami`, {
      headers: { 'x-access-token': token },
    });
    return response.data.data;
  },
};
