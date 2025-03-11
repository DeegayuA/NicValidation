import React from "react";

interface FileUploadProps {
  onChange: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  return (
    <input
      type="file"
      onChange={(e) => onChange(e.target.files ? Array.from(e.target.files) : [])}
      multiple
    />
  );
};

export default FileUpload;