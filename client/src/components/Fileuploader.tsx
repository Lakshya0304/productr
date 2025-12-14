import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [fileName, setFileName] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setFileName(file.name);
        onFileSelect(file); // Pass the actual File object back to parent
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border rounded-md p-4 text-center cursor-pointer h-24 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition ${
        isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />

      {isDragActive ? (
        <p className="text-blue-600 font-medium">Drop the file here...</p>
      ) : fileName ? (
        <p className="font-medium text-gray-700">{fileName}</p>
      ) : (
        <p className="text-gray-500">Drag & Drop or Click to Upload</p>
      )}
    </div>
  );
};

export default FileUploader;
