
let accessToken: string | null = null;

export const TokenStore = {
  get: () => accessToken,
  set: (token: string) => { accessToken = token; },
  clear: () => { accessToken = null; },
};