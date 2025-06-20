import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const validateSubmission = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/validate`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const healthCheck = async () => {
  return axios.get(`${API_BASE_URL}/health`);
};