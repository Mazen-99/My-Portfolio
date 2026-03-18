import API_URL from "./config";

// Get theme
export const getTheme = async () => {
  try {
    const response = await fetch(`${API_URL}/theme`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting theme:', error);
    throw error;
  }
};

// Update theme
export const setTheme = async (themeData, password) => {
  try {
    const response = await fetch(`${API_URL}/theme`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      body: JSON.stringify(themeData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update theme');
    return data;
  } catch (error) {
    console.error('Error updating theme:', error);
    throw error;
  }
};