import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { cn } from "../../lib/utils";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}

const ImagePreview = ({
  src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80",
  alt = "Preview image",
  className,
  width = 400,
  height = 300,
}: ImagePreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      className={cn(
        "relative rounded-md overflow-hidden bg-slate-100",
        className,
      )}
    >
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer transition-transform hover:scale-[0.98] active:scale-[0.97]">
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              className={cn(
                "object-cover rounded-md max-w-full h-auto",
                isLoading ? "blur-sm" : "blur-0",
              )}
              onLoad={() => setIsLoading(false)}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-200/50">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-1 bg-transparent border-none">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[80vh] object-contain rounded-md"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImagePreview;
