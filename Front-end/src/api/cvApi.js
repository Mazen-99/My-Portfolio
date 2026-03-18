import API_URL from "./config";

// Upload CV
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

// Delete CV
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

// Download CV
export const downloadCV = async () => {
  const response = await fetch(`${API_URL}/cv`)

  if (!response.ok) {
    let message = 'Failed to download CV'

    try {
      const data = await response.json()
      message = data.message || message
    } catch (_) { }

    const error = new Error(message)
    error.status = response.status
    throw error
  }

  const contentType = response.headers.get('content-type')

  if (!contentType || !contentType.includes('application/pdf')) {
    const error = new Error('Invalid file format')
    error.status = 400
    throw error
  }

  return await response.blob()
}