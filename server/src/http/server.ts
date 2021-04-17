import express from 'express';
import { Config } from '../utils/config';
import ControllersInterface from './interface';
import { applyMiddlewares } from './middleware';
import { applyRoutes } from './router';

export function createServer({ port, controllers, config }: {
  port: number,
  controllers: ControllersInterface,
  config: Config
}): express.Express {
  const app = express();

  applyMiddlewares(app, config);
  applyRoutes(app, controllers);

  app.listen(port, () => console.log(`Listening on port ${port}...`));

  return app;
}