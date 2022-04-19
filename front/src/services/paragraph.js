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
  async updateParagraph(token, idStory, idParagraph, content) {
    try {
      const response = await axios.put(
        `${BACKEND}/api/histoire/${idStory}/paragraphe/${idParagraph}`,
        {
          contenu: content,
        },
        {
          headers: { 'x-access-token': token },
        }
      );
      return response.data.paragraph;
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },
  async askToUpdateParagraph(token, idStory, idParagraph) {
    try {
      const response = await axios.put(
        `${BACKEND}/api/histoire/${idStory}/paragraphe/${idParagraph}/modified`,
        {},
        {
          headers: { 'x-access-token': token },
        }
      );
      return response.data.paragraph;
    } catch (e) {
      if (e.message === 'Request failed with status code 304') {
        throw 'You can already modify this paragraph';
      }
      throw e.response?.data?.message ?? e;
    }
  },
  async cancelModification(token, idStory, idParagraph) {
    try {
      const response = await axios.put(
        `${BACKEND}/api/histoire/${idStory}/paragraphe/${idParagraph}/cancel-modification`,
        {},
        {
          headers: { 'x-access-token': token },
        }
      );
      return response.data.paragraph;
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },
  async deleteParagraph(token, idStory, idParagraph) {
    try {
      const response = await axios.delete(
        `${BACKEND}/api/histoire/${idStory}/paragraphe/${idParagraph}`,
        {
          headers: { 'x-access-token': token },
        }
      );
      return response.data.message;
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },
  async getChoiceList(token, idStory, idParagraph) {
    try {
      const response = await axios.get(
        `${BACKEND}/api/histoire/${idStory}/paragraphe/${idParagraph}/choice-list`,
        {
          headers: { 'x-access-token': token },
        }
      );
      return response.data.choiceList;
    } catch (e) {
      throw e.response?.data?.message ?? e;
    }
  },
};
