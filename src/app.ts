import 'dotenv-safe/config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import { stream } from './configs/winston';
import swagger from './docs/swagger.json';
import errorHandler from './middlewares/errorHandler';
import validationErrorHandler from './middlewares/validationErrorHandler';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: false, limit: '30mb' }));
app.use(cookieParser());
app.use(
  logger(
    process.env.NODE_ENV === 'development' ? 'dev' : 'combined',
    process.env.NODE_ENV === 'development' ? undefined : { stream },
  ),
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

app.use(validationErrorHandler);
app.use(errorHandler);

mongoose.connect(
  process.env.DB_URI!,
  {
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      throw err;
    }

    console.log('db connected');
  },
);

export default app;
