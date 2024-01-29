import axios from 'axios';
import authHeader from './auth-header';
import { AdminUpdateFormValues, ChangePasswordFormValues, CreateAdminUserFormValues, ProfileUpdateFormValues, UserSearchValues } from '../utils/validator';

export const createAdmin = async (reqBody :CreateAdminUserFormValues) => {
  return await axios
    .post("/api/users/create_admin", reqBody, { headers: authHeader() });
}

export const updateUserProfile = async (body :ProfileUpdateFormValues) => {
  return await axios
    .put(`/api/users`,  body, { headers: authHeader() });
}

export const updateAdminProfile = async (body :AdminUpdateFormValues) => {
  return await axios
    .put(`/api/users/admin`,  body, { headers: authHeader() });
}

export const getUser = async (id: string) => {
  return await axios
    .get(`/api/users`, { headers: authHeader() });
}

export const getAllUsers = async (body: UserSearchValues) => {  
  return await axios
    .post('/api/users/search', body, { headers: authHeader() });
}

export const getAllAdmins = async () => {  
  return await axios
    .get('/api/users/admins', { headers: authHeader() });
}

export const deleteAdmin = async (id: string) => {
  return await axios.delete(`/api/users/${id}`, { headers: authHeader() });
}

export const changePassword = async (body :ChangePasswordFormValues) => {
  return await axios
    .post(`/api/users/change-password`, body, { headers: authHeader() });
}