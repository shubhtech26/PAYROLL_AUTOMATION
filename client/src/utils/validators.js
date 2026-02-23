export const required = (value) => (value ? true : 'This field is required');

export const emailValidator = (value) =>
  /^\S+@\S+\.\S+$/.test(value) ? true : 'Please provide a valid email';
