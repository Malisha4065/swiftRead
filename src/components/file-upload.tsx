import { useState } from "react";
import type { FC, DragEvent } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type FileUploadProps = {
  onUpload: (file: File) => void;
  error: string | null;
};

const FileUpload: FC<FileUploadProps> = ({ onUpload, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleClick = () => {
    document.getElementById('file-upload-input')?.click();
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <Card
      className={cn(
        "w-full max-w-lg mx-4 text-center border-2 border-dashed shadow-none bg-transparent transition-colors",
        isDragging ? "border-primary bg-primary/10" : "border-border"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardHeader>
        <CardTitle className="text-3xl font-bold tracking-tight">SwiftRead</CardTitle>
        <CardDescription>Upload a PDF document to begin speed reading.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4 text-left">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Upload Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        <div className="flex flex-col items-center justify-center space-y-6 p-8">
          <UploadCloud className={cn("w-16 h-16 text-muted-foreground transition-colors", isDragging && "text-primary")} />
          <p className="text-muted-foreground">Drag & drop a PDF here, or click to select a file.</p>
          <input
            id="file-upload-input"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button onClick={handleClick} size="lg">
            Select PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
