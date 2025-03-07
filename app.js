import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/constants.js';
import apiRouter from './routes/api.js';
import { errorHandler } from './middlewares/errorHandler.js';
import logger from './config/logger.js';

const app = express();

// Middlewares
app.use(cors({
    origin: "*", // allow to all

 // origin: config.CORS_ORIGIN,
  //credentials: true
}));
app.use(express.json());
app.use(morgan(config.ENV === 'development' ? 'dev' : 'combined'));

// Routes
app.use('/api', apiRouter);

// Error handling
app.use(errorHandler);

app.listen(config.PORT, () => {
  logger.info(`Server running in ${config.ENV} mode on port ${config.PORT}`);
});