import React, { useState, useRef, ChangeEvent } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Send, Image, X } from "lucide-react";

export type ChatMode = "text" | "image-analysis" | "image-generation";

interface InputAreaProps {
  mode: ChatMode;
  onSendMessage: (message: string, file?: File) => void;
  isProcessing?: boolean;
}

const InputArea = ({
  mode = "text",
  onSendMessage = () => {},
  isProcessing = false,
}: InputAreaProps) => {
  const [message, setMessage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (isProcessing) return;

    if (message.trim() || (mode === "image-analysis" && selectedFile)) {
      onSendMessage(message, selectedFile || undefined);
      setMessage("");
      if (mode === "image-analysis") {
        setSelectedFile(null);
        setImagePreview(null);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const getPlaceholderText = () => {
    switch (mode) {
      case "text":
        return "Type a message...";
      case "image-analysis":
        return "Upload an image and ask a question about it...";
      case "image-generation":
        return "Describe the image you want to generate...";
      default:
        return "Type a message...";
    }
  };

  return (
    <div className="w-full border-t bg-background p-4">
      {/* Image preview for image analysis mode */}
      {mode === "image-analysis" && imagePreview && (
        <div className="mb-3 flex items-center">
          <div className="relative h-16 w-16 overflow-hidden rounded-md">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute right-0 top-0 rounded-full bg-black/70 p-1 text-white hover:bg-black/90"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
          <span className="ml-2 text-sm text-muted-foreground">
            {selectedFile?.name}
          </span>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Main input area */}
        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholderText()}
            className="min-h-[60px] max-h-[200px] resize-none py-3"
            disabled={isProcessing}
          />
        </div>

        {/* File upload button (only visible in image analysis mode) */}
        {mode === "image-analysis" && (
          <div>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isProcessing}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={triggerFileUpload}
              disabled={isProcessing}
              aria-label="Upload image"
            >
              <Image size={20} />
            </Button>
          </div>
        )}

        {/* Send button */}
        <Button
          type="button"
          onClick={handleSend}
          disabled={
            isProcessing ||
            (message.trim() === "" &&
              (!selectedFile || mode !== "image-analysis"))
          }
          aria-label="Send message"
        >
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
};

export default InputArea;
