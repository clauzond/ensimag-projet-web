// token for "testuser" user
const TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6InRlc3R1c2VyIn0.56yrdVOXpeD7CKWq_hDlLFJH2jfOHHCmfchyKA8PaaA';

export const users = {
  async register(username, password) {
    return TOKEN;
  },

  async login(username, password) {
    return TOKEN;
  },

  async whoami(token) {
    if (token === TOKEN) {
      return 'testuser';
    } else {
      throw new Error('no user');
    }
  },
};
