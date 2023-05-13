import { atom } from 'recoil';
import { NodeObject } from 'utils/types';

// eslint-disable-next-line prefer-const
let nodeInfo: NodeObject = { id: 0, isActive: false, name: '' };

export const nodeAtom = atom({
  key: 'nodeAtom',
  default: nodeInfo,
});
