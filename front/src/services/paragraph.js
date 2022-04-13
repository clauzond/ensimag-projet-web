import axios from 'axios';
import { BACKEND } from '../globals';

export const paragraphService = {
  async getPublicParagraph(token, storyId, paragraphId) {
    try {
      const response = await axios.get(
        `${BACKEND}/api/readOnly/histoire/${storyId}/paragraphe/${paragraphId}`,
        {
          headers: { 'x-access-token': token, 'Content-Type': 'application/json' },
        }
      );
      return {
        story: response.data.story,
        paragraph: response.data.paragraph,
        choiceRowArray: response.data.choiceRowArray,
      };
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },
  async getParagraph(token, storyId, paragraphId) {
    try {
      const response = await axios.get(
        `${BACKEND}/api/histoire/${storyId}/paragraphe/${paragraphId}`,
        {
          headers: { 'x-access-token': token, 'Content-Type': 'application/json' },
        }
      );
      return {
        story: response.data.story,
        paragraph: response.data.paragraph,
        choiceRowArray: response.data.choiceRowArray,
      };
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },
};
