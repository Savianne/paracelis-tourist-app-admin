'use client';
import { useEffect } from 'react';
import { FileUploadWithPreview } from 'file-upload-with-preview';
import 'file-upload-with-preview/dist/style.css';

export default function FileUploader() {
  useEffect(() => {
    const upload = new FileUploadWithPreview('my-unique-id', {multiple: false, showDeleteButtonOnImages: true});

  }, []);

  return <div className="custom-file-container" data-upload-id="my-unique-id"></div>;
}
