import axios from 'axios';
import authHeader from './auth-header';
import { CreateTagFormValues, SearchValues, UpdateTagFormValues } from '../utils/validator';

export const createTag = async (body :CreateTagFormValues) => {
  return await axios
    .post(`/api/tags`,  body, { headers: authHeader() });
}

export const updateTag = async (body :UpdateTagFormValues) => {
  return await axios
    .put(`/api/tags`,  body, { headers: authHeader() });
}

export const getAllTag = async (body: SearchValues) => {  
  return await axios
    .post('/api/tags/search', body, { headers: authHeader() });
}

export const deleteTag = async (id: string) => {
  return await axios.delete(`/api/tags/${id}`, { headers: authHeader() });
}