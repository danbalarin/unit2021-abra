import { Response, Request, NextFunction } from 'express';
import UsersBusiness from '../business/users';

export default class UsersController {
  
  private bc: UsersBusiness;

  constructor(options: {
    bc: UsersBusiness
  }) {
    Object.assign(this, options);
  }

  async validate(req: Request, res: Response, next: NextFunction) {
    if (typeof req.headers.authtokenid !== "string") {
      return res.status(400).json({
        'error': `Header 'authTokenId' is not string.`,
      });
    }

    const token = req.headers.authtokenid as string;
    
    try {
      const user = await this.bc.getUserByAuthToken(token);
      res.locals.user = user;
      return next();
    } catch (e) {
      console.log(e?.isAxiosError ? e.response.statusText : e);
      return res.status(401).json({
        'error': `Your auth token is not valid. Please login again.`,
      });
    }
  }
}