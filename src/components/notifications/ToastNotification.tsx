import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastNotificationProps {
  /**
   * The type of notification to display
   */
  type?: ToastType;
  /**
   * The title of the notification
   */
  title?: string;
  /**
   * The message to display in the notification
   */
  message?: string;
  /**
   * Optional action button text
   */
  actionLabel?: string;
  /**
   * Optional action button callback
   */
  onAction?: () => void;
  /**
   * Duration in milliseconds to show the toast
   */
  duration?: number;
}

const ToastNotification = ({
  type = "info",
  title = "Notification",
  message = "This is a notification message",
  actionLabel,
  onAction,
  duration = 5000,
}: ToastNotificationProps) => {
  const { toast } = useToast();

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const showToast = () => {
    toast({
      title: (
        <div className="flex items-center gap-2">
          {getIcon()}
          <span>{title}</span>
        </div>
      ),
      description: message,
      duration: duration,
      variant: type === "error" ? "destructive" : "default",
      action: actionLabel ? (
        <button
          onClick={onAction}
          className={cn(
            "inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
            type === "error"
              ? "border-muted/40 hover:bg-destructive hover:text-destructive-foreground focus:ring-destructive"
              : "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
          )}
        >
          {actionLabel}
        </button>
      ) : undefined,
    });
  };

  // Component to demonstrate the toast
  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h3 className="text-lg font-medium mb-2">Toast Notification Component</h3>
      <p className="text-gray-600 mb-4">
        This component provides a standardized way to show toast notifications.
        Click the button below to see a demonstration.
      </p>
      <button
        onClick={showToast}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        Show {type} notification
      </button>
    </div>
  );
};

export default ToastNotification;
