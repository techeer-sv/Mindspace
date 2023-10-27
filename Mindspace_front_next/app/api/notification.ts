import { csrFetch } from "./utils/csrFetch";

interface Notification {
  notification_id: number;
  message: string;
}

export const getAllNotification = async (): Promise<Notification[]> => {
  const endpoint = "notifications";
  const response = await csrFetch(endpoint, {
    method: "get",
  });

  return response as Notification[];
};

export const deleteNotification = async (notification_id: number) => {
  const endpoint = `notifications/${notification_id}`;
  await csrFetch(endpoint, {
    method: "delete",
  });
};
