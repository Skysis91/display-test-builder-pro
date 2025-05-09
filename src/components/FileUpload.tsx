
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { CreativeFile } from '@/types';

interface FileUploadProps {
  onFilesAccepted: (files: CreativeFile[]) => void;
}

const FileUpload = ({ onFilesAccepted }: FileUploadProps) => {
  // Define accepted file types and size limit
  const ACCEPTED_FILE_TYPES = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp'],
  };
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Process files, create previews and get image dimensions
      const creativePromises = acceptedFiles.map(
        (file) =>
          new Promise<CreativeFile>((resolve) => {
            // Generate a unique ID for the file
            const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
            
            // Create URL preview
            const preview = URL.createObjectURL(file);
            
            // Get image dimensions
            const img = new Image();
            img.onload = () => {
              resolve({
                id,
                file,
                preview,
                width: img.width,
                height: img.height,
                clickUrl: '',
                impressionUrl1: '',
                impressionUrl2: '',
              });
            };
            img.onerror = () => {
              // Resolve without dimensions if we can't load the image
              resolve({
                id,
                file,
                preview,
                clickUrl: '',
                impressionUrl1: '',
                impressionUrl2: '',
              });
            };
            img.src = preview;
          })
      );

      Promise.all(creativePromises).then((creatives) => {
        onFilesAccepted(creatives);
        toast.success(`${creatives.length} files uploaded successfully`);
      });
    },
    [onFilesAccepted]
  );

  const onDropRejected = useCallback((rejectedFiles: any[]) => {
    rejectedFiles.forEach((rejected) => {
      if (rejected.errors[0]?.code === 'file-too-large') {
        toast.error(`File "${rejected.file.name}" is too large. Maximum size is 5MB.`);
      } else if (rejected.errors[0]?.code === 'file-invalid-type') {
        toast.error(`File "${rejected.file.name}" has an invalid type. Accepted: JPG, PNG, GIF, WebP.`);
      } else {
        toast.error(`File "${rejected.file.name}" couldn't be uploaded. ${rejected.errors[0]?.message}`);
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-brand-50 p-3">
          <Upload className="h-8 w-8 text-brand-500" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Drop creative files here or click to browse</h3>
          <p className="text-sm text-muted-foreground">
            Supports JPG, PNG, GIF, WebP (max 5MB each)
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
