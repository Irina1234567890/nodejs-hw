import { setupServer } from './server.js';
import dotenv from 'dotenv';

dotenv.config();

const startApp = () => {
  setupServer();
};

startApp();
