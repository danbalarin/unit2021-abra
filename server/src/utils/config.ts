import * as dotenv from 'dotenv-flow';

export type Config = {
  http: {
    port: number,
  },
  flexibee: {
    proxyUrl: string,
    apiUrl: string,
    companyName: string,
    username: string,
    password: string,
    companyUrl: string,
  },
  sensors: {
    apiUrl: string,
  }
};

function requireEnv(envName: string): string {
  if (!process.env[envName]) {
    throw new Error(`Variable '${envName}' is required!`);
  }

  return process.env[envName];
}

export function loadEnvConfig(): Config {
  dotenv.config();

  return {
    http: {
      port: Number.parseInt(requireEnv("HTTP_PORT")),
    },
    flexibee: {
      proxyUrl: requireEnv("FLEXIBEE_PROXY_URL"),
      apiUrl: requireEnv("FLEXIBEE_API_URL"),
      companyName: requireEnv("FLEXIBEE_COMPANY_NAME"),
      username: requireEnv("FLEXIBEE_USERNAME"),
      password: requireEnv("FLEXIBEE_PASSWORD"),
      companyUrl: requireEnv("FLEXIBEE_COMPANY_URL"),
    },
    sensors: {
      apiUrl: requireEnv("SENSORS_API_URL"),
    }
  };
}