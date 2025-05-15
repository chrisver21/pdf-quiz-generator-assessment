"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PDFDocument } from "pdf-lib";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Home() {
  const [error, setError] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [readHolder, setReadHolder] = useState<Uint8Array | null>(null);

  const uploadHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = event.target?.files[0];

    if (!file || file.type !== "application/pdf") {
      setError("Please upload valid PDF file!");
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const arrayBuffer = await file.arrayBuffer();
      const typedArr = new Uint8Array(arrayBuffer);

      try {
        const pdf = await PDFDocument.load(arrayBuffer);
        const numberOfPages = pdf.getPageCount();

        if (numberOfPages > 10) {
          setError("PDF has more than 10 pages please upload a smaller file!");
          return;
        }

        setPdfFile(file);
        setReadHolder(typedArr);
      } catch (err) {
        console.log("Error loading PDF: ", err);
        setError("Failed to Load PDF");
      }
    };
    fileReader.readAsArrayBuffer(file);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold">PDF Quiz Generator</h1>
      <input type="file" accept="application/pdf" onChange={uploadHandler} />
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {pdfFile && (
        <div className="mt-4">
          {`File: ${pdfFile.name} successfully uploaded. `}
        </div>
      )}
    </div>
  );
}
