import { Express, json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

export function applyMiddlewares(app: Express) {
  app.use(json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan('tiny'));
}