"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { notification } from "antd";
import ImageGreeting, { ImageGreetingHandle } from "./ImageGreeting";

interface FileUploadProps {
  maxFileSize?: number; // in bytes
  allowedFileTypes?: string[];
  onFileSelect?: (file: File) => void;
  onError?: (error: string) => void;
  className?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  ratio?: "5:7" | "1:1" | "";
  dear?: string;
  message?: string;
  from?: string;
  width?: string;
  onPreviewReady?: (ready: boolean) => void;
}

const FileUpload = forwardRef<ImageGreetingHandle, FileUploadProps>(
  (
    {
      maxFileSize = 5 * 1024 * 1024, // 5MB default
      allowedFileTypes = [],
      onFileSelect,
      onError,
      className = "",
      accept,
      multiple = false,
      disabled = false,
      ratio = "",
      dear = "",
      message = "",
      from = "",
      onPreviewReady,
      width = "436px",
    },
    ref
  ) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      return () => {
        imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      };
    }, [imagePreviews]);

    const showError = (errorMessage: string) => {
      notification.error({
        message: "File Upload Error",
        description: errorMessage,
        placement: "topRight",
      });
      onError?.(errorMessage);
    };

    const validateFile = (file: File): Promise<boolean> => {
      return new Promise((resolve) => {
        if (file.size > maxFileSize) {
          const errorMessage = `File size exceeds ${formatFileSize(
            maxFileSize
          )}`;
          showError(errorMessage);
          resolve(false);
          return;
        }

        if (
          allowedFileTypes.length > 0 &&
          !allowedFileTypes.includes(file.type)
        ) {
          const errorMessage = `File type ${
            file.type
          } is not allowed. Allowed types: ${allowedFileTypes.join(", ")}`;
          showError(errorMessage);
          resolve(false);
          return;
        }

        if (ratio && file.type.startsWith("image/")) {
          const img = new Image();
          img.onload = () => {
            const imageRatio = img.width / img.height;
            const targetRatio = getTargetRatio();

            if (targetRatio !== null) {
              const tolerance = 0.1;
              const ratioDifference = Math.abs(imageRatio - targetRatio);

              if (ratioDifference > tolerance) {
                const errorMessage = `Image aspect ratio (${imageRatio.toFixed(
                  2
                )}) doesn't match required ratio (${targetRatio?.toFixed(
                  2
                )}). Please use a ${ratio} image.`;
                showError(errorMessage);
                resolve(false);
                return;
              }
            }
            resolve(true);
          };
          img.onerror = () => {
            const errorMessage = "Failed to load image for validation";
            showError(errorMessage);
            resolve(false);
          };
          img.src = URL.createObjectURL(file);
        } else {
          resolve(true);
        }
      });
    };

    const getTargetRatio = (): number | null => {
      switch (ratio) {
        case "5:7":
          return 5 / 7;
        case "1:1":
          return 1;
        default:
          return null;
      }
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const handleFiles = async (files: FileList | null) => {
      if (!files) return;

      imagePreviews.forEach((url) => URL.revokeObjectURL(url));

      const fileArray = Array.from(files);
      const validFiles: File[] = [];
      const previews: string[] = [];

      for (const file of fileArray) {
        const isValid = await validateFile(file);
        if (isValid) {
          validFiles.push(file);
          if (file.type.startsWith("image/")) {
            previews.push(URL.createObjectURL(file));
          }
        }
      }

      if (validFiles.length > 0) {
        setSelectedFiles(
          multiple ? [...selectedFiles, ...validFiles] : validFiles
        );
        setImagePreviews(multiple ? [...imagePreviews, ...previews] : previews);
        validFiles.forEach((file) => onFileSelect?.(file));
        onPreviewReady?.(true);
      }
    };

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      await handleFiles(e.dataTransfer.files);
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      await handleFiles(e.target.files);
    };

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    const removeFile = (index: number) => {
      if (imagePreviews[index]) {
        URL.revokeObjectURL(imagePreviews[index]);
      }
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);
      const newPreviews = imagePreviews.filter((_, i) => i !== index);
      setImagePreviews(newPreviews);
      onPreviewReady?.(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const getAspectRatioClass = () => {
      switch (ratio) {
        case "5:7":
          return "aspect-[5/7]";
        case "1:1":
          return "aspect-square";
        default:
          return "";
      }
    };

    return (
      <div className={`w-full ${className}`}>
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${getAspectRatioClass()}
            ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            flex items-center justify-center
          `}
          style={{ width: width }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={
            !disabled && selectedFiles.length === 0
              ? handleButtonClick
              : undefined
          }
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
          />
          {selectedFiles.length > 0 && imagePreviews[0] ? (
            <div
              className={`relative w-full ${getAspectRatioClass()} min-h-[200px] flex items-center justify-center overflow-hidden`}
            >
              <ImageGreeting
                ref={ref}
                key={
                  (selectedFiles[0]?.name || "") +
                  "-" +
                  (imagePreviews[0] || "")
                }
                imageUrl={imagePreviews[0]}
                dear={dear}
                message={message}
                from={from}
                className="w-full h-full"
                hideDownloadButton={true}
              />
              <button
                type="button"
                onClick={() => removeFile(0)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 z-10"
                aria-label="Remove image"
              >
                <CloseOutlined />
              </button>
            </div>
          ) : (
            <div className="space-y-2 w-full">
              <div className="text-gray-600">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="text-gray-600">
                <span className="font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>{" "}
                or drag and drop
              </div>
              <p className="text-xs text-gray-500">
                {allowedFileTypes.length > 0 && (
                  <>Allowed types: {allowedFileTypes.join(", ")}</>
                )}
                {allowedFileTypes.length > 0 && maxFileSize && " • "}
                {maxFileSize && `Max size: ${formatFileSize(maxFileSize)}`}
                {ratio && ` • Ratio: ${ratio}`}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export default FileUpload;
