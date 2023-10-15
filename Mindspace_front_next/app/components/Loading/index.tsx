"use client";
import { getLottieOptions } from "@/utils/lottie";
import Lottie from "react-lottie";
import styles from "./Loading.module.scss";

const Loading = () => {
  return (
    <>
      <div className={styles.wrapper}>
        <Lottie
          options={getLottieOptions("/lotties/moon.json")}
          height={300}
          width={300}
        />
      </div>
    </>
  );
};

export default Loading;
