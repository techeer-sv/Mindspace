import { atom } from "recoil";
import { NodeObject } from "@/constants/types";

const initalNodeInfo: NodeObject = { id: 0, isWritten: false, name: "" };

export const nodeAtom = atom({
  key: "nodeAtom",
  default: initalNodeInfo,
});
