import express from 'express';
import cors from 'cors';
// import pino from 'pino-http';
import 'dotenv/config';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import notesRoutes from './routes/notesRoutes.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

// export const setupServer = () => {
//   const app = express();

//   app.use(cors());
//   app.use(express.json());
//   app.use(
//     pino({
//       transport:
//         process.env.NODE_ENV !== 'production'
//           ? { target: 'pino-pretty' }
//           : undefined,
//     }),
//   );

//   app.get('/notes', (req, res) => {
//     res.status(200).json({
//       message: 'Retrieved all notes',
//     });
//   });

//   app.get('/notes/:noteId', (req, res) => {
//     const { noteId } = req.params;
//     res.status(200).json({
//       message: `Retrieved note with ID: ${noteId}`,
//     });
//   });

//   app.get('/test-error', (req, res) => {
//     throw new Error('Simulated server error');
//   });

//   app.use((req, res) => {
//     res.status(404).json({
//       message: 'Route not found',
//     });
//   });

//   app.use((err, req, res, next) => {
//     res.status(500).json({
//       message: err.message || 'Internal Server Error',
//     });
//   });

//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// };
// setupServer();
// const app = express();
// const PORT = process.env.PORT ?? 3000;

// // Global middleware
// app.use(logger); // pino-http logger
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use(notesRoutes);

// // 404 handler
// app.use(notFoundHandler);

// // Error handler (last)
// app.use(errorHandler);

// const start = async () => {
//   await connectMongoDB();
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// };

// start();
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
