import React, { useState } from "react";
import MessageThread from "./MessageThread";
import ModeToggle from "./ModeToggle";
import InputArea from "./InputArea";
import TypingIndicator from "./TypingIndicator";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

// Import Puter.js (Ensure this is installed in your project)
import puter from "puter-js";

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

  // Handle mode change
  const handleModeChange = (newMode: ChatMode) => {
    setMode(newMode);

    // Add a system message when mode changes
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

  // Add a new message to the chat
  const addMessage = (message: MessageType) => {
    setMessages((prev) => [...prev, message]);
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

    // If there's an image file in image analysis mode
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

      if (mode === "text") {
        // 🔥 Get real AI response
        const textResponse = await puter.ai.chat(content);
        aiResponse.content = textResponse;

      } else if (mode === "imageAnalysis") {
        if (!file) {
          aiResponse.content = "Please upload an image for me to analyze.";
        } else {
          // 🔥 Get real AI image analysis
          const imageAnalysisResponse = await puter.ai.chat("What do you see in this image?", userMessage.imageUrl!);
          aiResponse.content = imageAnalysisResponse;
        }

      } else if (mode === "imageGeneration") {
        // 🔥 Generate AI Image
        toast({ title: "Generating image...", description: "Please wait while the AI creates an image." });

        const generatedImage = await puter.ai.txt2img(content);
        aiResponse.content = "Here's your generated image based on your prompt.";
        aiResponse.imageUrl = generatedImage.src;
        aiResponse.imageAlt = "Generated AI image";
        aiResponse.isGeneratedImage = true;
      }

      addMessage(aiResponse);
    } catch (error) {
      console.error("Puter AI Error:", error);
      toast({ title: "Error", description: "Failed to process your request. Please try again.", variant: "destructive" });
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
        mode={
          mode === "imageAnalysis"
            ? "image-analysis"
            : mode === "imageGeneration"
              ? "image-generation"
              : "text"
        }
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default ChatInterface;