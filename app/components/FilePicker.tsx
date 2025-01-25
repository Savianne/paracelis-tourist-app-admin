"use client"
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "GIF"];

function DragDrop() {
  const [file, setFile] = useState(null);
  const handleChange = (file:any) => {
    setFile(file);
  };

  return (
    <FileUploader error={true} handleChange={handleChange} name="file" types={fileTypes} />
  );
}

export default DragDrop;