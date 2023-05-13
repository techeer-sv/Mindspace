import { atom } from 'recoil';
import { NodeObject } from 'utils/types';

const initalNodeInfo: NodeObject = { id: 0, isActive: false, name: '' };

export const nodeAtom = atom({
  key: 'nodeAtom',
  default: initalNodeInfo,
});
