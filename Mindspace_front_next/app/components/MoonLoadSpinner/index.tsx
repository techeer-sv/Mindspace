"use client";
import { getLottieOptions } from "@/utils/lottie";
import Lottie from "react-lottie";
import styles from "./MoonLoadSpinner.module.scss";

const MoonLoadSpinner = () => {
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

export default MoonLoadSpinner;
