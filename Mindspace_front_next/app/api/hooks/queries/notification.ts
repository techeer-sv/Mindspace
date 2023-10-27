import { useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getAllNotification,
  deleteNotification,
  getNewNotification,
} from "@/api/notification";
import { NOTIFICATION_QUERIES } from "@/constants/queryKeys";

interface Notification {
  notification_id: number;
  message: string;
}

export const useAllNotificationQuery = () => {
  return useQuery<Notification[]>(
    [NOTIFICATION_QUERIES.ALL_NOTIFICATION],
    getAllNotification,
  );
};

export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (notification_id: number) => deleteNotification(notification_id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([NOTIFICATION_QUERIES.ALL_NOTIFICATION]);
      },
    },
  );
};

export const useNewNotificationPolling = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchNewNotification = async () => {
      try {
        await getNewNotification();
        queryClient.invalidateQueries([NOTIFICATION_QUERIES.ALL_NOTIFICATION]);
      } catch (error: any) {
        if (error.statusCode !== 404) {
          console.error("에러발생", error);
        }
      } finally {
        fetchNewNotification();
      }
    };

    fetchNewNotification();
  }, [queryClient]);
};
