"use client";

import { useState, useEffect } from "react";
import styles from "./Alarm.module.scss";
import { useRouter } from "next/navigation";

const Alarm = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleCloseNotification = (index: Number) => {
    console.log(`Notification ${index} closed`);
  };

  const notifications = [
    { id: 1, text: "알람1" },
    { id: 2, text: "알람2" },
    { id: 3, text: "알람3" },
  ];

  return (
    <div className={styles.alarm}>
      <button className={styles.alarm__button} onClick={handleToggle}>
        알림 버튼
      </button>
      {isVisible && (
        <div className={styles.alarm__list}>
          {notifications.length !== 0 ? (
            <>
              {notifications.map((notification) => (
                <div key={notification.id} className={styles.alarm__item}>
                  <span className={styles.alarm__item__text}>
                    {notification.text}
                  </span>
                  <button
                    className={styles.alarm__item__close}
                    onClick={() => handleCloseNotification(notification.id)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </>
          ) : (
            <>
              <div>현재 표현할 알림 정보가 없습니다</div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Alarm;
