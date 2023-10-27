import { useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getAllNotification } from "@/api/notification";
import { NOTIFICATION_QUERIES } from "@/constants/queryKeys";

import { APIErrorResponse } from "@/constants/types";

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