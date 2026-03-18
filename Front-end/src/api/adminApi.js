import API_URL from './config';

// Check admin password
// Backend expects the password in the `x-admin-password` header
export const checkAdmin = async (password) => {
  try {
    const response = await fetch(`${API_URL}/admin/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password,
      },
      // No body required by backend; authentication is header-based
    });

    // If response is not OK, read the error message and throw
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const message = err && err.message ? err.message : 'Unauthorized';
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking admin password:', error);
    throw error;
  }
};
