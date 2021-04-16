import { Config } from './config';

type Header = { 
  Authorization: string 
};

export default class Auth {
  private config: Config;

  constructor(options: { 
    config: Config 
  }) {
    Object.assign(this, options);
  }

  getBasicAuthHeader(): Header {
    const { username, password } = this.config.flexibee;
    const token = Buffer.from(username + ':' + password).toString('base64');

    return {
      'Authorization': 'Basic ' + token
    };
  }
}