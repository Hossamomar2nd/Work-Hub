import dotenv from "dotenv";

dotenv.config();

const requireNonEmptyEnv = (name) => {
  const value = process.env[name];

  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const validateOptionalPositiveIntegerEnv = (name) => {
  const value = process.env[name];

  if (value === undefined || value === null || value === "") return;

  const parsedValue = Number.parseInt(value, 10);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue <= 0 ||
    String(parsedValue) !== value.trim()
  ) {
    throw new Error(`${name} must be a positive integer when provided`);
  }
};

requireNonEmptyEnv("TOKEN_SECRETkEY");
validateOptionalPositiveIntegerEnv("SALT_ROUND");

export const env = {
  port: process.env.PORT || 3000,
};
