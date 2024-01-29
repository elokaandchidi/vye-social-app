import axios from 'axios';
import authHeader from './auth-header';
import { CreateTutorialFormValues, SearchValues, UpdateTutorialFormValues } from '../utils/validator';

export const createTutorial = async (body :CreateTutorialFormValues) => {
  return await axios
    .post(`/api/tutorials`,  body, { headers: authHeader() });
}

export const updateTutorial = async (body :UpdateTutorialFormValues) => {
  return await axios
    .put(`/api/tutorials`,  body, { headers: authHeader() });
}

export const getAllTutorial = async (body: SearchValues) => {  
  return await axios
    .post('/api/tutorials/search', body, { headers: authHeader() });
}