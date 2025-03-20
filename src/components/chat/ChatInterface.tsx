import React, { useState } from "react";
import MessageThread from "./MessageThread";
import ModeToggle from "./ModeToggle";
import InputArea from "./InputArea";
import TypingIndicator from "./TypingIndicator";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import puter from "puter.js"; // Ensure you have the correct import for Puter.js

// Define types
export interface MessageType {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  imageUrl?: string;
  imageAlt?: string;
  isGeneratedImage?: boolean;
}

export type ChatMode = "text" | "imageAnalysis" | "imageGeneration";

interface ChatInterfaceProps {
  initialMode?: ChatMode;
  initialMessages?: MessageType[];
}

const ChatInterface = ({
  initialMode = "text",
  initialMessages = [
    {
      id: "1",
      content: "Hello! How can I assist you today?",
      isUser: false,
      timestamp: new Date(Date.now() - 60000 * 5),
    },
  ],
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages);
  const [mode, setMode] = useState<ChatMode>(initialMode);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Add a new message to the chat
  const addMessage = (message: MessageType) => {
    setMessages((prev) => [...prev, message]);
  };

  // Handle mode change
  const handleModeChange = (newMode: ChatMode) => {
    setMode(newMode);

    const modeMessages: Record<ChatMode, string> = {
      text: "Switched to Text Chat mode. Ask me anything!",
      imageAnalysis: "Switched to Image Analysis mode. Upload an image for me to analyze.",
      imageGeneration: "Switched to Image Generation mode. Describe the image you'd like me to create.",
    };

    addMessage({
      id: Date.now().toString(),
      content: modeMessages[newMode],
      isUser: false,
      timestamp: new Date(),
    });
  };

  // Handle sending a message
  const handleSendMessage = async (content: string, file?: File) => {
    if (!content.trim() && !file) return;

    // Add user message
    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    if (mode === "imageAnalysis" && file) {
      userMessage.imageUrl = URL.createObjectURL(file);
      userMessage.imageAlt = file.name;
    }

    addMessage(userMessage);
    setIsProcessing(true);

    try {
      // Show typing indicator
      const typingMessage: MessageType = {
        id: "typing",
        content: "...",
        isUser: false,
        timestamp: new Date(),
      };
      addMessage(typingMessage);

      let aiResponse: MessageType;

      switch (mode) {
        case "text":
          const textResponse = await puter.ai.chat(content);
          aiResponse = {
            id: Date.now().toString(),
            content: textResponse,
            isUser: false,
            timestamp: new Date(),
          };
          break;

        case "imageAnalysis":
          if (!file) {
            aiResponse = {
              id: Date.now().toString(),
              content: "Please upload an image for analysis.",
              isUser: false,
              timestamp: new Date(),
            };
          } else {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
              const imageBase64 = reader.result as string;
              const analysisResponse = await puter.ai.chat("Analyze this image", imageBase64);
              aiResponse = {
                id: Date.now().toString(),
                content: analysisResponse,
                isUser: false,
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev.filter((msg) => msg.id !== "typing"), aiResponse]);
            };
            return;
          }
          break;

        case "imageGeneration":
          toast({ title: "Generating image...", description: "Please wait a moment." });
          const generatedImage = await puter.ai.txt2img(content);
          aiResponse = {
            id: Date.now().toString(),
            content: "Here is your generated image:",
            imageUrl: generatedImage.src,
            imageAlt: "Generated image based on your prompt",
            isGeneratedImage: true,
            isUser: false,
            timestamp: new Date(),
          };
          break;
      }

      // Remove typing indicator and add AI response
      setMessages((prev) => [...prev.filter((msg) => msg.id !== "typing"), aiResponse]);
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto bg-background rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-center">AI Assistant</h1>
      </div>

      <ModeToggle selectedMode={mode} onModeChange={handleModeChange} />

      <div className="flex-1 overflow-hidden">
        <Card className="h-full border-0 shadow-none">
          <CardContent className="p-0 h-full">
            <MessageThread messages={messages} isTyping={isProcessing} />
          </CardContent>
        </Card>
      </div>

      <InputArea
        mode={mode}
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default ChatInterface;