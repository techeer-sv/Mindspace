"use client";

import { useState } from "react";
import FormBox from "../components/FormBox";
import FormButton from "../components/FormButton";
import { useRouter } from "next/navigation";
import styles from "./../Auth.module.scss";

import { useSetRecoilState } from "recoil";
import { isLoggedInAtom } from "@/recoil/state/authAtom";

import { useSignInMutation } from "@/api/hooks/queries/user";

import Cookies from "js-cookie";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const setLoggedIn = useSetRecoilState(isLoggedInAtom);

  const handleLoginSuccess = (token: string) => {
    Cookies.set("accessToken", token, { expires: 1 });
    setLoggedIn(true);
    router.push("/");
    router.refresh();
  };

  const { mutate: loginMutation } = useSignInMutation(
    handleLoginSuccess,
    setErrorMessage,
  );

  const checkIsValid = () => {
    if (email === "") {
      setErrorMessage("이메일을 입력해 주세요");
      return false;
    }

    if (password === "") {
      setErrorMessage("비밀번호를 입력해 주세요");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const submitForm = async () => {
    if (checkIsValid()) {
      loginMutation({ email, password });
    }
  };

  return (
    <>
      <div className={styles.content}>
        <div className={styles.content__signin__box}>
          <span className={styles.content__title}>SIGN IN</span>
          <FormBox
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            placeholder="Email"
          />
          <FormBox
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            placeholder="Password"
          />
          <div className={styles.error}>{errorMessage}</div>
          <div className={styles.button_wapper}>
            <FormButton clickAction={submitForm} text="SIGN IN" />
            <FormButton
              clickAction={() => router.push("/signup")}
              text="SIGN UP"
            />
          </div>
        </div>
      </div>
    </>
  );
}
