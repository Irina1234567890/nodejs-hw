// import express from 'express';
// import cors from 'cors';
// // import pino from 'pino-http';
// import 'dotenv/config';

// import { connectMongoDB } from './db/connectMongoDB.js';
// import { logger } from './middleware/logger.js';
// import notesRoutes from './routes/notesRoutes.js';
// import { notFoundHandler } from './middleware/notFoundHandler.js';
// import { errorHandler } from './middleware/errorHandler.js';
// //
// export const setupServer = async () => {
//   const app = express();
//   const PORT = process.env.PORT || 3000;

//   await connectMongoDB();

//   app.use(logger);
//   app.use(express.json());
//   app.use(cors());

//   app.use(notesRoutes);

//   app.use(notFoundHandler);

//   app.use(errorHandler);

//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// };

// setupServer();


import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import notesRoutes from './routes/notesRoutes.js';
import { errors } from 'celebrate';

const app = express();

// 1. Загальні middleware
app.use(express.json());
app.use(cors());
app.use(logger);

// 2. Маршрути додатка
app.use(notesRoutes);

// 3. Обробник неіснуючих маршрутів (404)
// Він має бути ПІСЛЯ маршрутів, але ПЕРЕД обробниками помилок
app.use(notFoundHandler);

// 4. Спеціальний обробник помилок валідації Celebrate
// Він перехоплює помилки валідації та відправляє клієнту 400 Bad Request
app.use(errors());

// 5. Фінальний глобальний обробник помилок (500)
// Завжди останній у ланцюжку
app.use(errorHandler);

const PORT = process.env.PORT ?? 3000; // Виправлено порт на 3000 згідно з ТЗ

const startServer = async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
  }
};

startServer();
