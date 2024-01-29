import axios from 'axios';
import authHeader from './auth-header';
import { CreateCardDetailsFormValues } from '../utils/validator';

export const createCardDetails = async (body :CreateCardDetailsFormValues) => {
  return await axios
    .post(`/api/card_details`,  body, { headers: authHeader() });
}

export const getCardDetailsByUserId = async (userId: string) => {
  try {
    const response = await axios.get(`/api/card_details/${userId}`, { headers: authHeader() });
    return response.data.data; // Update the state with the data from the promise
  } catch (error) {
    console.error(error); // Log any errors
  }
  return 
}

export const deleteCardDetails = async (id: string) => {
  return await axios.delete(`/api/card_details/${id}`, { headers: authHeader() });
}