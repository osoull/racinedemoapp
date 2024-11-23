import { createContext, useContext, useState } from "react";
import { toast } from "sonner";

type NotificationsContextType = {
  showNotification: (message: string, type?: "success" | "error" | "info") => void;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(
  undefined
);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const showNotification = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    toast[type](message);
  };

  return (
    <NotificationsContext.Provider value={{ showNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};