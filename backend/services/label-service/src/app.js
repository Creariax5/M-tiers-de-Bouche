import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import labelRoutes from './routes/label.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'label-service' });
});

// Routes
app.use('/labels', labelRoutes);

export default app;
