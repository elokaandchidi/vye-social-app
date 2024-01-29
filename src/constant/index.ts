export const BASE_API_URL = process.env.REACT_APP_API_URL

export enum ErrorMessage {
  INVALID_FIRSTNAME = '⛔ First Name is required',
  INVALID_LASTNAME = '⛔ Last Name is required',
  INVALID_EMAIL = '⛔ Email is invalid',
  INVALID_PASSWORD = '⛔ Your password must contain at least an uppercase, a lowercase and a special character.',
  SUCCESSFULLY_SYNCED = `✅ Successfully synced`,
}

export enum ErrorTypes {
  ERROR_EMAIL = 'email',
  ERROR_PASSWORD = 'password',
  ERROR_FIRSTNAME = 'firstname',
  ERROR_LASTNAME = 'lastname',
}

export const errorMessageMap: Record<ErrorTypes, ErrorMessage> = {
  [ErrorTypes.ERROR_EMAIL]: ErrorMessage.INVALID_EMAIL,
  [ErrorTypes.ERROR_PASSWORD]: ErrorMessage.INVALID_PASSWORD,
  [ErrorTypes.ERROR_FIRSTNAME]: ErrorMessage.INVALID_FIRSTNAME,
  [ErrorTypes.ERROR_LASTNAME]: ErrorMessage.INVALID_LASTNAME,
}