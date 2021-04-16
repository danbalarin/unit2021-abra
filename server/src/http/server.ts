import express from 'express';
import IControllers from './interface';
import { applyMiddlewares } from './middleware';
import { applyRoutes } from './router';

export function createServer({ port, controllers }: {
  port: number,
  controllers: IControllers,
}): express.Express {
  const app = express();

  applyRoutes(app, controllers);
  applyMiddlewares(app);

  app.listen(port, () => console.log(`Listening on port ${port}...`));

  return app;
}