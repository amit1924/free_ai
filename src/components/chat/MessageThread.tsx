import React, { useRef, useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";

export type MessageType = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  imageUrl?: string;
  imageAlt?: string;
  isGeneratedImage?: boolean;
};

interface MessageThreadProps {
  messages: MessageType[];
  isTyping?: boolean;
}

const MessageThread = ({
  messages = [
    {
      id: "1",
      content: "Hello! How can I assist you today?",
      isUser: false,
      timestamp: new Date(Date.now() - 60000 * 5),
    },
    {
      id: "2",
      content: "I need help with analyzing an image.",
      isUser: true,
      timestamp: new Date(Date.now() - 60000 * 4),
    },
    {
      id: "3",
      content:
        "Sure! You can upload an image in the Image Analysis mode, and I'll analyze it for you.",
      isUser: false,
      timestamp: new Date(Date.now() - 60000 * 3),
    },
    {
      id: "4",
      content: "Can you also generate images?",
      isUser: true,
      timestamp: new Date(Date.now() - 60000 * 2),
    },
    {
      id: "5",
      content:
        "Yes! Switch to Image Generation mode and provide a text prompt describing what you want to see.",
      isUser: false,
      timestamp: new Date(Date.now() - 60000 * 1),
      imageUrl:
        "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80",
      imageAlt: "Example generated image",
      isGeneratedImage: true,
    },
  ],
  isTyping = false,
}: MessageThreadProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive or when typing starts/stops
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 rounded-md">
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg p-3 shadow-sm max-w-[80%] ${message.isUser ? "bg-blue-500 text-white" : "bg-white"}`}
              >
                <p>{message.content}</p>
                {message.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={message.imageUrl}
                      alt={message.imageAlt || "Image"}
                      className="rounded-md max-w-full h-auto"
                    />
                    {message.isGeneratedImage && (
                      <p className="text-xs mt-1 italic">Generated image</p>
                    )}
                  </div>
                )}
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start">
              <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageThread;
