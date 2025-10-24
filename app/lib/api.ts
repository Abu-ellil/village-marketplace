import axios from 'axios';
import { API_BASE_URL } from '../../utils/config';

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getServices = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/services`);
    return response.data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
};

export const getServiceById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/services/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching service with id ${id}:`, error);
    return null;
  }
};

export default { getProducts, getServices, getProductById, getServiceById };
