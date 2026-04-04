import API_URL from "./config";

// Upload CV to Cloudinary as a PDF (Admin only)
export const uploadCV = async (cvFile, password) => {
  try {
    const formData = new FormData();
    formData.append('cv', cvFile);

    const response = await fetch(`${API_URL}/cv`, {
      method: 'POST',
      headers: {
        'x-admin-password': password
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to upload CV');
    return data;
  } catch (error) {
    console.error('Error uploading CV:', error);
    throw error;
  }
};

// Reset/Delete CV from Cloudinary (Admin only)
export const deleteCV = async (password) => {
  try {
    const response = await fetch(`${API_URL}/cv`, {
      method: 'DELETE',
      headers: {
        'x-admin-password': password,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete CV');
    return data;
  } catch (error) {
    console.error('Error deleting CV:', error);
    throw error;
  }
};

// Get the direct CV download URL
export const getCvDownloadUrl = () => {
  return `${API_URL}/cv`;
};