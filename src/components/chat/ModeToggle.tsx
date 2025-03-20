import React from "react";
import { MessageSquare, Image, ImagePlus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type ChatMode = "text" | "imageAnalysis" | "imageGeneration";

interface ModeToggleProps {
  selectedMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

const ModeToggle = ({
  selectedMode = "text",
  onModeChange = () => {},
}: ModeToggleProps) => {
  return (
    <div className="flex justify-center w-full bg-background p-2">
      <Tabs
        defaultValue={selectedMode}
        onValueChange={(value) => onModeChange(value as ChatMode)}
        className="w-full max-w-md"
      >
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Text Chat</span>
          </TabsTrigger>
          <TabsTrigger
            value="imageAnalysis"
            className="flex items-center gap-2"
          >
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">Image Analysis</span>
          </TabsTrigger>
          <TabsTrigger
            value="imageGeneration"
            className="flex items-center gap-2"
          >
            <ImagePlus className="h-4 w-4" />
            <span className="hidden sm:inline">Image Generation</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ModeToggle;
