import dotenv from "dotenv";
dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  SIMILARITY_THRESHOLD: parseFloat(process.env.SIMILARITY_THRESHOLD || "0.6"),
  DATABASE: process.env.DATABASE,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  PORTDB: process.env.PORTDB,
  HOST: process.env.HOST,
};
