import API_URL from './config';

// Get about information
export const getAbout = async () => {
  try {
    const response = await fetch(`${API_URL}/about`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting about data:', error);
    throw error;
  }
};

// Update about information
export const updateAbout = async (aboutData, password) => {
  try {
    const formData = new FormData();

    // Append simple fields
    formData.append('name', aboutData.name);
    formData.append('phone', aboutData.phone);
    formData.append('email', aboutData.email);
    formData.append('bio', aboutData.bio);
    formData.append('description', aboutData.description);

    // Handle CV (Already base64 string or null)
    if (aboutData.cv) formData.append('cv', aboutData.cv);

    // Stringify fields for the backend to parse
    formData.append('titles', JSON.stringify(aboutData.titles));
    formData.append('skills', JSON.stringify(aboutData.skills));
    formData.append('socials', JSON.stringify(aboutData.socials));

    const response = await fetch(`${API_URL}/about`, {
      method: 'PUT',
      headers: {
        'x-admin-password': password,
        // Content-Type is set automatically by the browser for FormData
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update');
    return data;
  } catch (error) {
    console.error('Error updating about data:', error);
    throw error;
  }
};
