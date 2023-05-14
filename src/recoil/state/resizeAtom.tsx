import { atom } from 'recoil';

const initalMousePostion = { x: 0, y: 0 };

export const ModalWidthAtom = atom({
  key: 'ModalWidth',
  default: 800,
});

export const ModalHeightAtom = atom({
  key: 'ModalHeight',
  default: 800,
});

export const mousePositionAtom = atom({
  key: 'mousePosition',
  default: initalMousePostion,
});
