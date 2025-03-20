import React, { useState } from "react";
import MessageThread from "./MessageThread";
import ModeToggle from "./ModeToggle";
import InputArea from "./InputArea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

declare const puter: any; // ✅ Declare Puter.js global variable

// Message Type Definition
export interface MessageType {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  imageUrl?: string;
  imageAlt?: string;
  isGeneratedImage?: boolean;
}

// Chat Mode Definition
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

  // Handle Mode Change
  const handleModeChange = (newMode: ChatMode) => {
    setMode(newMode);

    const modeMessages = {
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

  // Add Message to the Chat
  const addMessage = (message: MessageType) => {
    setMessages((prev) => [...prev, message]);
  };

  // Handle Sending a Message
  const handleSendMessage = async (content: string, file?: File) => {
    if (!content.trim() && !file) return;

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
      let aiResponse: MessageType = {
        id: Date.now().toString(),
        content: "",
        isUser: false,
        timestamp: new Date(),
      };

      if (!puter || !puter.ai) {
        console.error("Puter.js is not loaded.");
        toast({
          title: "Error",
          description: "Puter.js failed to load. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      if (mode === "text") {
        let aiText = "";
        const response = await puter.ai.chat(content, { stream: true });

        for await (const part of response) {
          aiText += part?.text || "";
        }

        aiResponse.content = aiText || "Error: No response received.";

      } else if (mode === "imageAnalysis") {
        if (!file) {
          aiResponse.content = "Please upload an image for me to analyze.";
        } else {
          const imageAnalysisResponse = await puter.ai.chat(
            "What do you see in this image?",
            userMessage.imageUrl!
          );
          aiResponse.content = imageAnalysisResponse.text || "Error: No response received.";
        }

      } else if (mode === "imageGeneration") {
        toast({
          title: "Generating image...",
          description: "Please wait while the AI creates an image.",
        });

        const generatedImage = await puter.ai.txt2img(content);
        aiResponse.content = "Here's your generated image.";
        aiResponse.imageUrl = generatedImage.src;
        aiResponse.imageAlt = "Generated AI image";
        aiResponse.isGeneratedImage = true;
      }

      addMessage(aiResponse);
    } catch (error) {
      console.error("Puter AI Error:", error);
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
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold text-center">AI Assistant</h1>
      </div>

      {/* Mode Toggle */}
      <ModeToggle selectedMode={mode} onModeChange={handleModeChange} />

      {/* Message Thread */}
      <div className="flex-1 overflow-hidden">
        <Card className="h-full border-0 shadow-none">
          <CardContent className="p-0 h-full">
            <MessageThread messages={messages} isTyping={isProcessing} />
          </CardContent>
        </Card>
      </div>

      {/* Input Area */}
      <InputArea
        mode={mode}
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default ChatInterface;