import pkg from 'pg';
import { CONFIG } from './env.js';

const { Pool } = pkg;

export const pool = new Pool({
  user: CONFIG.USER,
  host: CONFIG.HOST,
  database: CONFIG.DATABASE,
  password: CONFIG.PASSWORD,
  port: CONFIG.PORTDB,
});
