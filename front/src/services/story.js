import axios from 'axios';
import { BACKEND } from '../globals';

export const storyService = {
  async getPublicAuthentifiedStories(token) {
    try {
      const response = await axios.get(`${BACKEND}/api/histoire`, {
        headers: { 'x-access-token': token },
      });
      return response.data.stories;
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },
  async getPublicStories() {
    try {
      const response = await axios.get(`${BACKEND}/api/readOnly/histoire`);
      return response.data.stories;
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },
};
