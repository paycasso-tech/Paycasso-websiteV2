import React, { useRef, useState } from "react";
import { Trash2, UploadCloud } from "lucide-react";

interface FileUploadProps {
  onSubmit: (file: File) => Promise<void>;
  label?: string;
  acceptedFileTypes?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onSubmit,
  label = "Choose File",
  acceptedFileTypes = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setloading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setloading(true);
      try {
        await onSubmit(selectedFile);
      } catch (err) {
        console.error("Upload error", err);
      } finally {
        setloading(false);
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
      />

      {/* File box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center justify-between px-4 py-2 min-w-[240px] max-w-[320px] border border-dashed border-gray-500 rounded-xl text-sm cursor-pointer hover:border-white text-gray-300"
      >
        <span className="truncate max-w-[80%]">
          {selectedFile ? selectedFile.name : label}
        </span>

        {selectedFile && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveFile();
            }}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Upload button */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={!selectedFile || loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm ${
          selectedFile
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-700 text-gray-400 cursor-not-allowed"
        }`}
      >
        <UploadCloud size={16} />
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default FileUpload;
