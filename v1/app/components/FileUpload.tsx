"use client";

import { useState, useRef, useCallback } from 'react';
import { useIPFSUpload } from '@/lib/hooks/use-ipfs-upload';

interface FileUploadProps {
  onUploadSuccess: (result: { hash: string; url: string }) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({
  onUploadSuccess,
  onUploadError,
  multiple = false,
  accept = "image/png",
  maxSize = 10,
  className = "",
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const { uploadFile, uploadFiles, isUploading, uploadProgress, error, reset } = useIPFSUpload();

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // Check file type
      if (!file.type.includes('png')) {
        onUploadError?.('Only PNG files are allowed');
        return false;
      }
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        onUploadError?.(`File size must be less than ${maxSize}MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setSelectedFiles(validFiles);
    
    // Auto-upload if single file, or show selection for multiple
    if (!multiple || validFiles.length === 1) {
      handleUpload(validFiles);
    }
  }, [multiple, maxSize, onUploadError]);

  const handleUpload = async (files: File[]) => {
    try {
      if (files.length === 1) {
        const result = await uploadFile(files[0], { pin: true });
        if (result.success && result.hash && result.url) {
          onUploadSuccess({ hash: result.hash, url: result.url });
          reset();
          setSelectedFiles([]);
        } else {
          onUploadError?.(result.error || 'Upload failed');
        }
      } else {
        const results = await uploadFiles(files, { pin: true });
        const successfulUploads = results.filter(r => r.success && r.hash && r.url);
        
        if (successfulUploads.length > 0) {
          // Use the first successful upload
          const firstSuccess = successfulUploads[0];
          onUploadSuccess({ 
            hash: firstSuccess.hash!, 
            url: firstSuccess.url! 
          });
          reset();
          setSelectedFiles([]);
        } else {
          onUploadError?.('All uploads failed');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      onUploadError?.(errorMessage);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Drag and drop area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {isUploading ? (
          <div className="space-y-3">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600">Uploading to IPFS...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">{uploadProgress}%</p>
          </div>
        ) : selectedFiles.length > 0 ? (
          <div className="space-y-3">
            <p className="text-gray-600">Selected files:</p>
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm text-gray-700">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload(selectedFiles);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Upload {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📁</div>
            <p className="text-gray-600 font-medium">
              Drop PNG files here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Maximum file size: {maxSize}MB
            </p>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
