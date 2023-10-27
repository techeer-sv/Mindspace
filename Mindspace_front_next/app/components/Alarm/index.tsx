"use client";

import { useState, useEffect } from "react";
import styles from "./Alarm.module.scss";
import {
  useAllNotificationQuery,
  useDeleteNotificationMutation,
} from "@/api/hooks/queries/notification";

const Alarm = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  const handleCloseNotification = (notification_id: number) => {
    deleteNotification(notification_id);
  };

  const renderNotificationCount = () => {
    const count = notificationList.length;
    return count > 9 ? "+9" : count.toString();
  };

  const { data: notificationList = [] } = useAllNotificationQuery();

  const { mutate: deleteNotification } = useDeleteNotificationMutation();

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
        {notificationList.length > 0 && (
          <div className={styles.alarm__notification}>
            {renderNotificationCount()}
          </div>
        )}
      </button>
      {isVisible && (
        <div className={styles.alarm__list}>
          {notificationList.length !== 0 ? (
            <>
              {notificationList.map((notification) => (
                <div
                  key={notification.notification_id}
                  className={styles.alarm__item}
                >
                  <span className={styles.alarm__item__text}>
                    {notification.message}
                  </span>
                  <button
                    className={styles.alarm__item__close}
                    onClick={() =>
                      handleCloseNotification(notification.notification_id)
                    }
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
