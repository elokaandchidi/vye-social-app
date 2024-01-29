import axios from "axios";
import { ForgotPasswordFormValues, LoginFormValues, ResetPasswordFormValues, SignupFormValues } from "../utils/validator";

export const login = async ({email, password} :LoginFormValues) => {
  return await axios
  .post("/api/auth/login", {
    email,
    password
  })
}

export const register = async ({email, password, firstname,lastname} :SignupFormValues) => {
    return await axios
      .post("/api/auth/register", {
        firstname,
        lastname,
        email,
        password
      });
}

export const forgotPassword = async ({email, url} :ForgotPasswordFormValues) => {
    return await axios
      .post("/api/auth/forgot-password", {
        email,
        url
      });
}

export const resetPassword = async ({email, password, token} :ResetPasswordFormValues) => {
    return await axios
      .post("/api/auth/reset-password", {
        email,
        password,
        token
      });
}

export const getCurrentUser = () =>{
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
}

export const getToken = () =>{
  const tokenStr = localStorage.getItem("token");
  if (tokenStr) return JSON.parse(tokenStr);

  return null;
}

export const logout = () =>{
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  return
}
