import express from 'express';
import cors from 'cors';
// import pino from 'pino-http';
import 'dotenv/config';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import notesRoutes from './routes/notesRoutes.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
//
export const setupServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  await connectMongoDB();

  app.use(logger);
  app.use(express.json());
  app.use(cors());

  app.use(notesRoutes);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

setupServer();
