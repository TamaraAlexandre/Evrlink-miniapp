// IPFS Service for uploading PNG assets
// Uses a generic IPFS HTTP endpoint for decentralized storage

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
    this.gateway =
      process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io/ipfs/";
    this.uploadEndpoint =
      process.env.NEXT_PUBLIC_IPFS_UPLOAD_ENDPOINT ||
      "https://ipfs.infura.io:5001/api/v0/add";
  }

  /**
   * Upload a PNG file to IPFS
   */
  async uploadPNG(
    file: File,
    options: IPFSUploadOptions = {}
  ): Promise<IPFSUploadResult> {
    try {
      if (!file.type.includes("png")) {
        throw new Error("File must be a PNG image");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB");
      }

      const formData = new FormData();
      formData.append("file", file);

      if (options.pin) {
        formData.append("pin", "true");
      }

      const response = await fetch(this.uploadEndpoint, {
        method: "POST",
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
      }

      throw new Error("No hash returned from IPFS");
    } catch (error) {
      console.error("IPFS upload error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown IPFS upload error",
      };
    }
  }
}

const ipfsService = new IPFSService();

export const uploadPNG = (file: File, options?: IPFSUploadOptions) =>
  ipfsService.uploadPNG(file, options);

