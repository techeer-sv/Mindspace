import { atom } from 'recoil';

export const ModalWidthAtom = atom({
  key: 'ModalWidth',
  default: window.innerWidth * 0.8,
});

export const ModalHeightAtom = atom({
  key: 'ModalHeight',
  default: window.innerHeight * 0.6,
});
