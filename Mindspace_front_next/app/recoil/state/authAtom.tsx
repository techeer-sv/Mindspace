import { atom } from "recoil";
import Cookies from "js-cookie";

const checkLoggedIn = Cookies.get("accessToken") !== undefined;

export const isLoggedInAtom = atom({
  key: "isLoggedInAtom",
  default: checkLoggedIn,
});
