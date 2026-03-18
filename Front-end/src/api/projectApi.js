import API_URL from './config';

// Get all projects
export const getProjects = async () => {
  try {
    const response = await fetch(`${API_URL}/projects`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

// Add a new project
export const createProject = async (formData, password) => {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: {
        'x-admin-password': password,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create project');
    return data;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

// Update a project
export const updateProject = async (projectId, formData, password) => {
  try {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'x-admin-password': password,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update project');
    return data;
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId, password) => {
  try {
    const response = await fetch(`${API_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'x-admin-password': password,
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete project');
    return data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};
