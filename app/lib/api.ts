import axios from 'axios';
import { API_BASE_URL } from '../../utils/config';

export const getProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products`);
  return response.data;
};

export const getServices = async () => {
  const response = await axios.get(`${API_BASE_URL}/services`);
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/products/${id}`);
  return response.data;
};

export const getServiceById = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/services/${id}`);
  return response.data;
};

export default { getProducts, getServices, getProductById, getServiceById };
