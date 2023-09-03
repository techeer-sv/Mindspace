import { atom } from 'recoil';

const checkLoggedIn = localStorage.getItem('accessToken') !== null;

export const isLoggedInAtom = atom({
  key: 'isLoggedInAtom',
  default: checkLoggedIn,
});

export const userInfoAtom = atom({
  key: 'userInfoAtom',
  default: null,
});
