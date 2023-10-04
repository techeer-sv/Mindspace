"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./../Auth.module.scss";
import FormBox from "../components/FormBox";
import FormButton from "../components/FormButton";
import { createUser } from "@/api/auth";
// import { useSignUpMutation } from '@/hooks/queries/user';
//TODO: recoil 및 api연결 로직에 대한 처리가 필요합니다. (일단 주석처리)

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  // const { mutate: signupMutation } = useSignUpMutation(() => {
  //   navigate('/signin');
  // }, setErrorMessage);

  const checkIsValid = () => {
    if (email === "") {
      setErrorMessage("이메일을 입력해 주세요");
      return false;
    }

    if (userName === "") {
      setErrorMessage("닉네임을 입력해 주세요");
      return false;
    }

    if (password === "") {
      setErrorMessage("비밀번호를 입력해 주세요");
      return false;
    }
    if (passwordConfirm === "") {
      setErrorMessage("비밀번호 확인을 입력해 주세요");
      return false;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("재확인 비밀번호가 일치하지 않습니다.");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const submitForm = async () => {
    if (checkIsValid()) {
      console.log(userName, email, password);
      // signupMutation({ userName, email, password });
      try {
        // API 호출
        await createUser({
          userName,
          email,
          password,
        });
        router.push("/signin");
      } catch (error: any) {
        setErrorMessage(error.errorMessage);
      }
    }
  };

  return (
    <>
      <div className={styles.content}>
        <div className={styles.content__signup__box}>
          <span className={styles.content__title}>Create Account</span>
          <FormBox
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            placeholder="Email"
          />
          <FormBox
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
            type="text"
            placeholder="Nickname"
          />
          <FormBox
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
          />
          <FormBox
            type="password"
            value={passwordConfirm}
            onChange={(e) => {
              setPasswordConfirm(e.target.value);
            }}
            placeholder="Password Check"
          />
          <div className={styles.error}>{errorMessage}</div>
          <div className={styles.button_wapper}>
            <FormButton text="SIGN UP" clickAction={submitForm} />
          </div>
        </div>
      </div>
    </>
  );
}
