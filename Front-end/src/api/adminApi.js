import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin`;

/**
 * Check if admin is authorized using the specialized 'x-admin-password' header.
 */
export const checkAdminAuth = async (password) => {
  try {
    const response = await axios.post(`${API_URL}/check`, {}, {
      headers: { 'x-admin-password': password }
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

/**
 * Track a visitor on landing (Public endpoint)
 */
export const trackVisit = async () => {
  try {
    const response = await axios.post(`${API_URL}/track-visit`);
    return response.data;
  } catch (error) {
    console.error('Track visit error:', error);
  }
};

/**
 * Get visitor analytics (Admin only)
 */
export const getVisitors = async (password) => {
  try {
    const response = await axios.get(`${API_URL}/visitors`, {
      headers: { 'x-admin-password': password }
    });
    return response.data;
  } catch (error) {
    console.error('Get visitors error:', error);
    throw error;
  }
};

/**
 * Delete a single visitor log entry
 */
export const deleteVisitor = async (id, password) => {
  try {
    const response = await axios.delete(`${API_URL}/visitors/${id}`, {
      headers: { 'x-admin-password': password }
    });
    return response.data;
  } catch (error) {
    console.error('Delete visitor error:', error);
    throw error;
  }
};

/**
 * Clear the entire visitor log history
 */
export const deleteAllVisitors = async (password) => {
  try {
    const response = await axios.delete(`${API_URL}/visitors`, {
      headers: { 'x-admin-password': password }
    });
    return response.data;
  } catch (error) {
    console.error('Clear visitors history error:', error);
    throw error;
  }
};
