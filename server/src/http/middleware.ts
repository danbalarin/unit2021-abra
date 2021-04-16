import { Express, json } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import proxy from 'express-http-proxy';
import { Config } from '../utils/config';

export function applyMiddlewares(app: Express, config: Config) {
  app.use(json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan('tiny'));
  app.use('/flexibee', proxy(config.flexibee.proxyUrl));
}