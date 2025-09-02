// IPFS Service for uploading PNG assets
// Uses IPFS HTTP client for decentralized storage

export interface IPFSUploadResult {
  success: boolean;
  hash?: string;
  url?: string;
  error?: string;
}

export interface IPFSUploadOptions {
  pin?: boolean;
  metadata?: Record<string, any>;
}

class IPFSService {
  private gateway: string;
  private uploadEndpoint: string;

  constructor() {
    // Use Infura IPFS as default (you can change this to any IPFS provider)
    this.gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
    this.uploadEndpoint = process.env.NEXT_PUBLIC_IPFS_UPLOAD_ENDPOINT || 'https://ipfs.infura.io:5001/api/v0/add';
  }

  /**
   * Upload a PNG file to IPFS
   * @param file - PNG file to upload
   * @param options - Upload options
   * @returns Promise with upload result
   */
  async uploadPNG(file: File, options: IPFSUploadOptions = {}): Promise<IPFSUploadResult> {
    try {
      // Validate file type
      if (!file.type.includes('png')) {
        throw new Error('File must be a PNG image');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);

      // Add pin option if specified
      if (options.pin) {
        formData.append('pin', 'true');
      }

      // Upload to IPFS
      const response = await fetch(this.uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.Hash) {
        return {
          success: true,
          hash: result.Hash,
          url: `${this.gateway}${result.Hash}`,
        };
      } else {
        throw new Error('No hash returned from IPFS');
      }

    } catch (error) {
      console.error('IPFS upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown upload error',
      };
    }
  }

  /**
   * Upload multiple PNG files to IPFS
   * @param files - Array of PNG files
   * @param options - Upload options
   * @returns Promise with array of upload results
   */
  async uploadMultiplePNGs(files: File[], options: IPFSUploadOptions = {}): Promise<IPFSUploadResult[]> {
    const uploads = files.map(file => this.uploadPNG(file, options));
    return Promise.all(uploads);
  }

  /**
   * Get IPFS gateway URL for a hash
   * @param hash - IPFS hash
   * @returns Full IPFS URL
   */
  getIPFSURL(hash: string): string {
    return `${this.gateway}${hash}`;
  }

  /**
   * Validate IPFS hash format
   * @param hash - Hash to validate
   * @returns Boolean indicating if hash is valid
   */
  isValidIPFSHash(hash: string): boolean {
    // Basic IPFS hash validation (Qm... for CIDv0, bafy... for CIDv1)
    return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash) || /^bafy[a-z2-7]{55}$/.test(hash);
  }

  /**
   * Get file info from IPFS hash
   * @param hash - IPFS hash
   * @returns Promise with file info
   */
  async getFileInfo(hash: string): Promise<any> {
    try {
      const response = await fetch(`${this.uploadEndpoint.replace('/add', '/object/get')}?arg=${hash}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get file info: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting file info:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const ipfsService = new IPFSService();

// Export individual functions for convenience
export const uploadPNG = (file: File, options?: IPFSUploadOptions) => 
  ipfsService.uploadPNG(file, options);

export const uploadMultiplePNGs = (files: File[], options?: IPFSUploadOptions) => 
  ipfsService.uploadMultiplePNGs(files, options);

export const getIPFSURL = (hash: string) => ipfsService.getIPFSURL(hash);

export const isValidIPFSHash = (hash: string) => ipfsService.isValidIPFSHash(hash);
