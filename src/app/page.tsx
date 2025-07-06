"use client";

import FileUpload from "@/components/FileUpload";
import GreetingCardForm from "@/components/GreetingCardForm";
import React, { useState, useRef, useEffect } from "react";
import { ImageGreetingHandle } from "@/components/ImageGreeting";
import type { GreetingCardFormData } from "@/components/GreetingCardForm";

export default function Home() {
  const [dear, setDear] = useState("");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [previewReady, setPreviewReady] = useState(false);
  const [canDownload, setCanDownload] = useState(false);
  const fileUploadRef = useRef<ImageGreetingHandle>(null);

  const handleFormChange = (field: string, value: string) => {
    if (field === "dear") setDear(value);
    if (field === "message") setMessage(value);
    if (field === "from") setFrom(value);
  };

  const handleSubmit = async (values: GreetingCardFormData) => {
    console.log("Form data:", values);
  };

  const handleDownloadCard = () => {
    if (!fileUploadRef.current) {
      setTimeout(() => {
        if (fileUploadRef.current) {
          fileUploadRef.current.download();
        } else {
          alert(
            "Please wait a moment after uploading the image, then try again."
          );
        }
      }, 100);
      return;
    }
    fileUploadRef.current.download();
  };

  const handleFileSelect = () => {
    // no-op, just for compatibility
  };

  const handlePreviewReady = (ready: boolean) => {
    setPreviewReady(ready);
  };

  useEffect(() => {
    setCanDownload(previewReady && !!fileUploadRef.current);
  }, [previewReady, fileUploadRef.current]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="flex lg:flex-row flex-col gap-6">
        <div
          className="overflow-x-auto w-full lg:w-[436px]"
          style={{ maxWidth: "100vw" }}
        >
          <div className="w-[436px] min-w-[436px]">
            <FileUpload
              ref={fileUploadRef}
              allowedFileTypes={["image/png", "image/jpeg"]}
              onError={(error) => console.log("Validation error:", error)}
              onFileSelect={handleFileSelect}
              dear={dear}
              message={message}
              from={from}
              ratio="1:1"
              onPreviewReady={handlePreviewReady}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex-1 sm:w-[436px] w-full">
          <GreetingCardForm
            dear={dear}
            message={message}
            from={from}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            onDownloadCard={handleDownloadCard}
            loading={false}
            disabledDownload={!canDownload}
          />
        </div>
      </div>
    </div>
  );
}
