import axios from 'axios';
import authHeader from './auth-header';
import { CreateFaqFormValues, SearchValues, UpdateFaqFormValues } from '../utils/validator';

export const createFaq = async (body :CreateFaqFormValues) => {
  return await axios
    .post(`/api/faqs`,  body, { headers: authHeader() });
}

export const updateFaq = async (body :UpdateFaqFormValues) => {
  return await axios
    .put(`/api/faqs`,  body, { headers: authHeader() });
}

export const getAllFaq = async (body: SearchValues) => {  
  return await axios
    .post('/api/faqs/search', body, { headers: authHeader() });
}