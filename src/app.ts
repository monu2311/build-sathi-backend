import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes';

const app = express();

app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(morgan('dev'));

// Body parser — MUST come before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'BuildSathi API is running',
  });
});

// API routes
app.use('/api/v1', routes);

export default app;