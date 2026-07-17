interface ImgBBResponse {
  data: {
    url: string;
    display_url: string;
    delete_url: string;
  };
  success: boolean;
  error?: {
    message: string;
  };
}

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_KEY;

  if (!apiKey) {
    throw new Error("ImgBB API key not configured");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${apiKey}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result: ImgBBResponse = await response.json();

  if (!result.success || !response.ok) {
    throw new Error(result.error?.message || "Image upload failed");
  }

  return result.data.url;
};
