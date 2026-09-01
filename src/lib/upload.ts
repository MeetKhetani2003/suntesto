export interface UploadResult {
  url?: string;
  error?: string;
}

/**
 * Shared utility for uploading files to /api/upload with client-side size and type validation.
 * Supports image and video uploads with robust HTTP response parsing.
 */
export async function uploadFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[]; // e.g. ["image/", "video/"]
  } = {}
): Promise<UploadResult> {
  const maxSizeMB = options.maxSizeMB ?? 5; // Default max size is 5MB
  const allowedTypes = options.allowedTypes ?? ["image/"];

  // 1. Validate file existence
  if (!file) {
    return { error: "No file selected." };
  }

  // 2. Validate file type
  const isAllowed = allowedTypes.some((type) => file.type.startsWith(type));
  if (!isAllowed) {
    const formattedTypes = allowedTypes.map(t => t.replace("/", "s")).join(" or ");
    return {
      error: `Invalid file type. Only ${formattedTypes} are allowed.`
    };
  }

  // 3. Validate file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { error: `File size exceeds the limit of ${maxSizeMB}MB.` };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        return { error: data.error || `Upload failed with status ${res.status}` };
      } else {
        const text = await res.text();
        if (res.status === 413) {
          return { error: `File size is too large for the server. Please upload a file smaller than ${maxSizeMB}MB.` };
        }
        return { error: `Upload failed (Status ${res.status}): ${text.substring(0, 100)}` };
      }
    }

    const data = await res.json();
    if (data.url) {
      return { url: data.url };
    } else {
      return { error: data.error || "Failed to retrieve upload URL." };
    }
  } catch (err: any) {
    console.error("File upload utility error:", err);
    return { error: err.message || "Network error occurred during upload. Please check your connection." };
  }
}
