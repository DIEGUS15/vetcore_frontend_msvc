import axiosInstance from './axios';

export const getSchedule = async (vetId) => {
  try {
    const response = await axiosInstance.get(`/schedule/${vetId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};