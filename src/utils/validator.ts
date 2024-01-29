import { EMAIL_REGEX, PASSWORD_REGEX } from './regex';

export interface SignupFormValues {
  firstname: string
  lastname: string
  email: string
  password: string
}

export interface CreateAdminUserFormValues  extends SignupFormValues  {
  is_database: boolean
  is_questionbank: boolean
  is_tutorial: boolean
  is_news: boolean
  is_tags: boolean
}

export interface LoginFormValues {
  email: string
  password: string
}

export interface ForgotPasswordFormValues {
  email: string
  url: string
}

export interface ResetPasswordFormValues {
  email: string | null
  password: string
  token: string | null
}

export interface ChangePasswordFormValues {
  id: string
  password: string
  oldpassword: string
}

export interface ProfileUpdateFormValues {
  id: string
  firstname: string
  lastname: string
  title: string
  email?: string
  role?: string
  mobile?: string
}

export interface AdminUpdateFormValues {
  id: string
  oldpassword: string
  password: string
  is_database: boolean
  is_questionbank: boolean
  is_tutorial: boolean
  is_news: boolean
}

export interface CreateCardDetailsFormValues {
  user_id: string
  card_number: string
  expiry_date: string
  cvv: string
}

export interface CreateSubjectFormValues {
  title: string
  description?: string
}

export interface AnswerFormValues {
  option_text: string
  iscorrect: boolean
}

export interface CreateQuestionFormValues {
  title: string
  score: number
  subject_id: string
  type: string
  arrayOfOptions: AnswerFormValues[]
}

export interface UpdateAnswerFormValues {
  id?: string
  option_text: string
  iscorrect: boolean
}

export interface UpdateQuestionFormValues {
  id: string
  title: string
  score: number
  arrayOfOptions: UpdateAnswerFormValues[]
}

export interface CreateFaqFormValues {
  title: string
  description: string
  tags?: string[]
}

export interface UpdateFaqFormValues {
  id: string
  title: string
  status: string
  description: string
  tags?: string[]
}

export interface CreateNewsFormValues {
  title: string
  subtitle: string
  image_url?: string
  description: string
  tags?: string[]
}

export interface UpdateNewsFormValues {
  id: string
  title: string
  subtitle: string
  image_url?: string
  status: string
  description: string
  tags?: string[]
}

export interface CreateTutorialFormValues {
  title: string
  subtitle: string
  image_url?: string
  description: string
}

export interface UpdateTutorialFormValues {
  id: string
  title: string
  subtitle: string
  image_url?: string
  status: string
  description: string
}

export interface CreateTagFormValues {
  title: string
}

export interface UpdateTagFormValues {
  id: string
  title: string
  status: string
  description: string
}

export interface SearchValues {
  title?: string
  status?: string
}

export interface UserSearchValues {
  code: string
  role: string
  plan: string
  email: string
}

export const validateEmail = (email: string) => {
  return EMAIL_REGEX.test(email);
}

export const validatePassword = (password: string) => {
  return PASSWORD_REGEX.test(password);
}

export const isEmpty = (value: string) => {
  return !value;
}

