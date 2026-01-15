"use client";

import { useState } from "react";
import FileUpload from "@/components/file-upload";
import SpeedReader from "@/components/speed-reader";
import * as pdfjs from "pdfjs-dist";

// Make sure to provide the worker script path
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function Home() {
  const [documentText, setDocumentText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setError(null);
    if (file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (!e.target?.result) return;
      try {
        const loadingTask = pdfjs.getDocument(new Uint8Array(e.target.result as ArrayBuffer));
        const pdf = await loadingTask.promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(" ");
        }
        setDocumentText(text);
      } catch (err: any) {
        console.error("Failed to parse PDF:", err);
        setError(err.message || "Failed to parse PDF. The file might be corrupted or protected.");
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
    }
    reader.readAsArrayBuffer(file);
  };

  const handleExit = () => {
    setDocumentText(null);
    setError(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      {documentText ? (
        <SpeedReader text={documentText} onExit={handleExit} />
      ) : (
        <FileUpload onUpload={handleFileUpload} error={error} />
      )}
    </main>
  );
}
