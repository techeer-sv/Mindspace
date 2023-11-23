"use client";
import Cookies from "js-cookie";
import Alarm from "../Alarm";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "@/recoil/state/authAtom";
import {
  useUserNicknameQuery,
  useClearUserNicknameCache,
} from "@/api/hooks/queries/user";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  const [isLoggedIn, setLoggedIn] = useRecoilState(isLoggedInAtom);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  const { data: userNickname } = useUserNicknameQuery(isLoggedIn);

  const logout = () => {
    setLoggedIn(false);
    alert("로그아웃 되었습니다");
    queryClient.clear();
    router.push("/");
    router.refresh();
    Cookies.remove("accessToken");
  };

  useClearUserNicknameCache(isLoggedIn);
  useEffect(() => {
    const handleResize = () => {
      setIsNavExpanded(false);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setIsClient(true);
    const isCurrentlyLoggedIn = Cookies.get("accessToken") !== undefined;
    setLoggedIn(isCurrentlyLoggedIn);
  }, []);

  if (!isClient) {
    // 서버사이드 렌더링 단계에서 보여줄 기본 틀
    return (
      <nav className={styles.navbar}>
        <Link href="/" className={styles.navbar__title}>
          <Image
            src="/images/MindSpaceText.webp"
            alt="logo"
            width={250}
            height={50}
            loading="eager"
          />
        </Link>
        <div
          className={
            isNavExpanded
              ? `${styles.navbar__menu} ${styles["navbar__menu--expanded"]}`
              : styles.navbar__menu
          }
        >
          <ul>
            <li>
              <span>{"-"}</span>
            </li>
            <li>
              <span>{"-"}</span>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.navbar__title}>
        <Image
          src="/images/MindSpaceText.webp"
          alt="logo"
          width={250}
          height={50}
          loading="eager"
        />
      </Link>
      <button
        className={styles.navbar__hamburger}
        onClick={() => {
          setIsNavExpanded(!isNavExpanded);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="yellow"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
      <div
        className={
          isNavExpanded
            ? `${styles.navbar__menu} ${styles["navbar__menu--expanded"]}`
            : styles.navbar__menu
        }
      >
        <ul>
          {isLoggedIn ? (
            <>
              <li
                className={
                  isNavExpanded
                    ? `${styles["navbar__menu--expanded__text"]}`
                    : styles.navbar__menu__text
                }
              >
                <span>{userNickname}</span>
              </li>
              <li>
                <span onClick={logout}>logout</span>
              </li>
              <li>
                <Alarm />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/signin">SignIn</Link>
              </li>
              <li>
                <Link href="/signup">SignUp</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
