import axios from 'axios';
import authHeader from './auth-header';
import { CreateNewsFormValues, SearchValues, UpdateNewsFormValues } from '../utils/validator';

export const createNews = async (body :CreateNewsFormValues) => {
  return await axios
    .post(`/api/news`,  body, { headers: authHeader() });
}

export const updateNews = async (body :UpdateNewsFormValues) => {
  return await axios
    .put(`/api/news`,  body, { headers: authHeader() });
}

export const getAllNews = async (body: SearchValues) => {  
  return await axios
    .post('/api/news/search', body, { headers: authHeader() });
}

export const getAllNewsBasedOnTag = async (body: {tagIds: string[]}) => {
  console.log(body);
   
  return await axios
    .post('/api/news/search/with_tags', body, { headers: authHeader() });
}