"use client";

import { useState, useEffect } from "react";
import styles from "./Alarm.module.scss";

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="yellow"
          width="24px"
          height="24px"
        >
          <path d="M12 2C8.1 2 5 5.1 5 9v6l-1 2v1h18v-1l-1-2V9c0-3.9-3.1-7-7-7zm0 18c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z"></path>
        </svg>
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
