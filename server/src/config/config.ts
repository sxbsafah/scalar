import dotenv from "dotenv";


dotenv.config();

export type UserButton = {
  name: string,
}

export const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGINS: [""],
};

