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
  async getUserStories(token) {
    try {
      const response = await axios.get(`${BACKEND}/api/histoire/own`, {
        headers: { 'x-access-token': token },
      });
      return response.data.stories;
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },
  async modifyStory(token, idStory, isOpened, isPublic) {
    try {
      const response = await axios.put(
        `${BACKEND}/api/histoire/${idStory}`,
        {
          estPublique: isPublic,
          estOuverte: isOpened,
        },
        { headers: { 'x-access-token': token } }
      );
      return response.data.data;
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },
};
