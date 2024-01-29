import axios from 'axios';
import authHeader from './auth-header';
import { CreateQuestionFormValues, SearchValues, UpdateQuestionFormValues } from '../utils/validator';

export const createQuestion = async (body :CreateQuestionFormValues) => {
  return await axios
    .post(`/api/questions`,  body, { headers: authHeader() });
}

export const createBulkQuestions = async (body : any) => {
  return await axios
    .post(`/api/questions/bulk_upload`,  body, { headers: authHeader() });
}

export const updateQuestion = async (body :UpdateQuestionFormValues) => {
  return await axios
    .put(`/api/questions`,  body, { headers: authHeader() });
}

export const getAllSubjects = async (body: SearchValues) => {  
  return await axios
    .post('/api/subjects/search', body, { headers: authHeader() });
}