import React from "react";
import { Avatar } from "../ui/avatar";
import { cn } from "../../lib/utils";

export type MessageType = "user" | "ai";
export type ContentType = "text" | "image" | "generated-image";

export interface ChatMessageProps {
  type: MessageType;
  content: string;
  contentType: ContentType;
  timestamp?: string;
  isLoading?: boolean;
}

const ChatMessage = ({
  type = "user",
  content = "Hello there!",
  contentType = "text",
  timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  isLoading = false,
}: ChatMessageProps) => {
  const isUser = type === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-4 max-w-3xl",
        isUser ? "justify-end ml-auto" : "justify-start mr-auto",
        "bg-transparent",
      )}
    >
      <div
        className={cn(
          "flex gap-3 max-w-[80%]",
          isUser ? "flex-row-reverse" : "flex-row",
        )}
      >
        <Avatar
          className={cn("h-8 w-8", isUser ? "bg-blue-500" : "bg-green-500")}
        >
          <div className="flex h-full w-full items-center justify-center text-white font-semibold">
            {isUser ? "U" : "AI"}
          </div>
        </Avatar>

        <div
          className={cn("flex flex-col", isUser ? "items-end" : "items-start")}
        >
          <div
            className={cn(
              "rounded-lg p-3",
              isUser
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-800",
              contentType !== "text" ? "overflow-hidden" : "",
            )}
          >
            {contentType === "text" && (
              <p className="whitespace-pre-wrap break-words">{content}</p>
            )}

            {(contentType === "image" || contentType === "generated-image") && (
              <div className="image-preview-container">
                <img
                  src={content}
                  alt={
                    contentType === "image"
                      ? "Uploaded image"
                      : "AI generated image"
                  }
                  className="max-w-full rounded"
                />
              </div>
            )}
          </div>

          <span className="text-xs text-gray-500 mt-1">{timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
