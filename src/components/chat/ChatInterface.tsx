import React, { useState } from "react";
import MessageThread from "./MessageThread";
import ModeToggle from "./ModeToggle";
import InputArea from "./InputArea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

declare const puter: any; // ✅ Ensure Puter.js global variable is available

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

      // ✅ Ensure `puter.js` is available
      if (!puter || !puter.ai) {
        console.error("❌ Puter.js is not loaded.");
        toast({
          title: "Error",
          description: "Puter.js failed to load. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      // ✅ FIXED: Text Generation
      if (mode === "text") {
        console.log("📝 Sending text request:", content);
        let aiText = "";

        try {
          const response = await puter.ai.chat(content);
          console.log("📝 AI Response:", response);
          aiText = response.text || "Error: No response received.";
        } catch (error) {
          console.error("❌ Text Generation Error:", error);
          aiText = "Error: Failed to generate response.";
        }

        aiResponse.content = aiText;
      }

      // ✅ FIXED: Image Analysis (Uploads before analyzing)
      else if (mode === "imageAnalysis") {
        if (!file) {
          aiResponse.content = "Please upload an image for me to analyze.";
        } else {
          try {
            console.log("📤 Uploading image...");
            const uploadedImage = await puter.storage.upload(file);
            console.log("✅ Uploaded Image URL:", uploadedImage?.url);

            if (!uploadedImage?.url) {
              aiResponse.content = "Error: Image upload failed.";
            } else {
              console.log("🔍 Analyzing image...");
              const imageAnalysisResponse = await puter.ai.chat("Analyze this image for me.", {
                image: uploadedImage.url,
              });

              console.log("🔍 AI Image Analysis Response:", imageAnalysisResponse);
              aiResponse.content = imageAnalysisResponse?.text || "Error: No response received.";
            }
          } catch (error) {
            console.error("❌ Image Analysis Error:", error);
            aiResponse.content = "Error: Failed to analyze image.";
          }
        }
      }

      // ✅ FIXED: Image Generation
      else if (mode === "imageGeneration") {
        toast({
          title: "Generating image...",
          description: "Please wait while the AI creates an image.",
        });

        try {
          console.log("🎨 Generating image with prompt:", content);
          const generatedImage = await puter.ai.txt2img(content);
          console.log("🎨 Generated Image Response:", generatedImage);

          if (generatedImage?.url || generatedImage?.src) {
            aiResponse.content = "Here's your generated image.";
            aiResponse.imageUrl = generatedImage.url || generatedImage.src;
            aiResponse.imageAlt = "Generated AI image";
            aiResponse.isGeneratedImage = true;
          } else {
            aiResponse.content = "Error: Image generation failed.";
          }
        } catch (error) {
          console.error("❌ Image Generation Error:", error);
          aiResponse.content = "Error: Failed to generate image.";
        }
      }

      addMessage(aiResponse);
    } catch (error) {
      console.error("❌ Puter AI Error:", error);
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