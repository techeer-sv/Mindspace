import { atom } from "recoil";

const checkLoggedIn =
  typeof window !== "undefined"
    ? localStorage.getItem("accessToken") !== null
    : false;

export const isLoggedInAtom = atom({
  key: "isLoggedInAtom",
  default: checkLoggedIn,
});
