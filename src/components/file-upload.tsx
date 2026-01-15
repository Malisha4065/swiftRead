import type { FC } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type FileUploadProps = {
  onUpload: (file: File) => void;
  error: string | null;
};

const FileUpload: FC<FileUploadProps> = ({ onUpload, error }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleClick = () => {
    document.getElementById('file-upload-input')?.click();
  }

  return (
    <Card className="w-full max-w-lg mx-4 text-center border-2 border-dashed shadow-none bg-transparent">
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
          <UploadCloud className="w-16 h-16 text-muted-foreground" />
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
