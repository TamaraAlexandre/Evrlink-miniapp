import { useState, useCallback } from 'react';
import { uploadPNG, uploadMultiplePNGs, type IPFSUploadResult, type IPFSUploadOptions } from '../ipfs-service';

export interface UseIPFSUploadReturn {
  uploadFile: (file: File, options?: IPFSUploadOptions) => Promise<IPFSUploadResult>;
  uploadFiles: (files: File[], options?: IPFSUploadOptions) => Promise<IPFSUploadResult[]>;
  isUploading: boolean;
  uploadProgress: number;
  lastResult: IPFSUploadResult | null;
  error: string | null;
  reset: () => void;
}

export function useIPFSUpload(): UseIPFSUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lastResult, setLastResult] = useState<IPFSUploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File, options?: IPFSUploadOptions): Promise<IPFSUploadResult> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      // Simulate progress (since IPFS doesn't provide progress callbacks)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await uploadPNG(file, options);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setLastResult(result);

      if (!result.success) {
        setError(result.error || 'Upload failed');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setLastResult({ success: false, error: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      setIsUploading(false);
    }
  }, []);

  const uploadFiles = useCallback(async (files: File[], options?: IPFSUploadOptions): Promise<IPFSUploadResult[]> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      const results = await uploadMultiplePNGs(files, options);
      
      // Check if any uploads failed
      const failedUploads = results.filter(result => !result.success);
      if (failedUploads.length > 0) {
        const errorMessage = `${failedUploads.length} upload(s) failed`;
        setError(errorMessage);
      }

      setUploadProgress(100);
      setLastResult(results[results.length - 1] || null);

      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return [{ success: false, error: errorMessage }];
    } finally {
      setIsUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsUploading(false);
    setUploadProgress(0);
    setLastResult(null);
    setError(null);
  }, []);

  return {
    uploadFile,
    uploadFiles,
    isUploading,
    uploadProgress,
    lastResult,
    error,
    reset,
  };
}
