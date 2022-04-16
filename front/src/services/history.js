import axios from 'axios';
import { BACKEND } from '../globals';

export const historyService = {
  async saveHistory(token, storyId, arrayParagraph) {
    try {
      const response = await axios.post(
        `${BACKEND}/api/historique/${storyId}`,
        {
          arrayParagraphe: arrayParagraph,
        },
        { headers: { 'x-access-token': token, 'Content-Type': 'application/json' } }
      );
      return response.data.history;
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },
  async getHistory(token, storyId) {
    try {
      const response = await axios.get(`${BACKEND}/api/historique/${storyId}`, {
        headers: { 'x-access-token': token, 'Content-Type': 'application/json' },
      });
      return response.data.history;
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },
  async clearHistory(token, storyId) {
    try {
      const response = await axios.delete(`${BACKEND}/api/historique/${storyId}`, {
        headers: { 'x-access-token': token, 'Content-Type': 'application/json' },
      });
      return response.data.history;
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },
};
