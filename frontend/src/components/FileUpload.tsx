import { Upload, X } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  maxSize?: number; // in MB
}

const FileUpload = ({ 
  onFileSelect, 
  accept = ".mp3,.wav", 
  label = "Upload Audio File",
  maxSize = 50
}: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>("");

  const validateFile = (file: File) => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }
    setError("");
    return true;
  };

  const handleFileChange = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  }, []);

  const handleRemove = () => {
    setSelectedFile(null);
    setError("");
  };

  return (
    <div className="w-full space-y-2">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-xl border-2 border-dashed p-8 transition-all",
          isDragging 
            ? "border-primary bg-primary/10" 
            : "border-muted hover:border-primary/50",
          error && "border-destructive"
        )}
      >
        <input
          type="file"
          accept={accept}
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
        
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-primary/20 p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{label}</p>
            <p className="text-sm text-muted-foreground">
              Drag & drop or click to browse
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Supported: {accept} (Max {maxSize}MB)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive animate-fade-in">{error}</p>
      )}

      {selectedFile && (
        <div className="flex items-center justify-between rounded-lg bg-card p-3 animate-slide-in">
          <div className="flex items-center gap-2">
            <div className="rounded bg-primary/20 p-2">
              <Upload className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
