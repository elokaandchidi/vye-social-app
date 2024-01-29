import axios from 'axios';
import authHeader from './auth-header';
import { CreateSubjectFormValues, SearchValues } from '../utils/validator';

export const createSubject = async (body :CreateSubjectFormValues) => {
  return await axios
    .post(`/api/subjects`,  body, { headers: authHeader() });
}

export const getAllSubjects = async (body: SearchValues) => {  
  return await axios
    .post('/api/subjects/search', body, { headers: authHeader() });
}

export const getSubjectById = async (id: any, order: string) => {  
  return await axios
    .get(`/api/subjects/${id}?order=${order}`, { headers: authHeader() });
}