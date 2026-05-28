import argon2 from 'argon2';

export const hashPassword = async (password: string) => {
  return argon2.hash(password);
};

export const checkPasswordHash = async (password: string, hashed: string) => {
  return argon2.verify(hashed, password);
};
